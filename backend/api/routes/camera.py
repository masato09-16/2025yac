"""
Camera detection API routes
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import cv2
import numpy as np
from pathlib import Path
import logging

from database.session import get_db
from database.models.occupancy import Occupancy as DBOccupancy, OccupancyHistory
from database.models.classroom import Classroom
from camera.detector import YOLODetector
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/camera", tags=["camera"])

# グローバルなYOLO検出器インスタンス（初回使用時に初期化）
_yolo_detector: Optional[YOLODetector] = None


def get_yolo_detector() -> YOLODetector:
    """YOLO検出器のシングルトンインスタンスを取得"""
    global _yolo_detector
    if _yolo_detector is None:
        model_path = settings.detection_model_path if hasattr(settings, 'detection_model_path') else "yolov8n.pt"
        _yolo_detector = YOLODetector(model_path=model_path)
    return _yolo_detector


@router.post("/detect")
async def detect_people(
    file: UploadFile = File(..., description="画像ファイル"),
    classroom_id: str = Form(..., description="教室ID"),
    db: Session = Depends(get_db)
):
    """
    画像から人数を検出し、データベースを更新する
    
    - 画像ファイルを受け取る
    - YOLOv8で人物（class_id=0）を検出
    - 人数をカウント
    - 解析結果画像（バウンディングボックス付き）を保存
    - データベースのOccupancyテーブルを更新
    """
    try:
        # 教室の存在確認
        classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if not classroom:
            raise HTTPException(status_code=404, detail=f"教室が見つかりません: {classroom_id}")
        
        # 画像ファイルの読み込み
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="画像の読み込みに失敗しました")
        
        logger.info(f"画像を受信しました: {file.filename}, サイズ: {image.shape}")
        
        # YOLO検出器を取得
        detector = get_yolo_detector()
        
        # 人物検出（バウンディングボックス付き画像も取得）
        annotated_image, person_count, avg_confidence = detector.detect_with_annotations(image)
        
        logger.info(f"検出結果 - 教室ID: {classroom_id}, 人数: {person_count}, 信頼度: {avg_confidence:.2f}")
        
        # 解析結果画像を保存
        # backendディレクトリを基準にstatic/processedディレクトリを作成
        backend_dir = Path(__file__).parent.parent.parent
        static_dir = backend_dir / "static" / "processed"
        static_dir.mkdir(parents=True, exist_ok=True)
        
        output_path = static_dir / f"{classroom_id}.jpg"
        cv2.imwrite(str(output_path), annotated_image)
        logger.info(f"解析結果画像を保存しました: {output_path}")
        
        # データベースのOccupancyテーブルを更新
        occupancy = db.query(DBOccupancy).filter(DBOccupancy.classroom_id == classroom_id).first()
        
        if occupancy:
            # 既存レコードを更新
            occupancy.current_count = person_count
            occupancy.detection_confidence = float(avg_confidence)
        else:
            # 新規レコードを作成
            occupancy = DBOccupancy(
                id=f"occ_{classroom_id}",
                classroom_id=classroom_id,
                current_count=person_count,
                detection_confidence=float(avg_confidence),
            )
            db.add(occupancy)
        
        # 履歴レコードを作成
        from datetime import datetime
        history = OccupancyHistory(
            id=f"hist_{classroom_id}_{datetime.utcnow().timestamp()}",
            classroom_id=classroom_id,
            timestamp=datetime.utcnow(),
            count=person_count,
            detection_confidence=float(avg_confidence),
            camera_id=None,
        )
        db.add(history)
        
        db.commit()
        db.refresh(occupancy)
        
        # 画像URLを構築
        image_url = f"/static/processed/{classroom_id}.jpg"
        
        return {
            "classroom_id": classroom_id,
            "person_count": person_count,
            "confidence": float(avg_confidence),
            "image_url": image_url,
            "message": f"{person_count}人を検出しました"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"人数検出処理でエラーが発生しました: {e}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"処理中にエラーが発生しました: {str(e)}")

