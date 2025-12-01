"""
PCカメラからリアルタイムで人数検出を行い、直接データベースを更新するスクリプト
（APIサーバー不要版）

使用方法:
    python capture_camera_direct.py --classroom-id bus1-105

必要な環境変数 (.env):
    DATABASE_URL=postgresql://...
"""
import argparse
import time
import cv2
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from ultralytics import YOLO

# パス設定
current_dir = Path(__file__).resolve().parent
sys.path.append(str(current_dir))

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def setup_database():
    """データベース接続のセットアップ"""
    load_dotenv()
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        logger.error("DATABASE_URLが設定されていません。.envファイルを確認してください。")
        sys.exit(1)
    
    try:
        engine = create_engine(database_url)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        
        # 接続テスト
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("データベース接続成功")
        return SessionLocal
    except Exception as e:
        logger.error(f"データベース接続エラー: {e}")
        sys.exit(1)

def update_occupancy(db, classroom_id, count, confidence, camera_id="pc_direct"):
    """データベースの占有状況を更新"""
    try:
        # 現在の時刻
        now = datetime.now()
        
        # 既存のレコードを確認
        check_query = text("""
            SELECT id FROM occupancy WHERE classroom_id = :classroom_id
        """)
        result = db.execute(check_query, {"classroom_id": classroom_id}).fetchone()
        
        if result:
            # 更新
            update_query = text("""
                UPDATE occupancy 
                SET current_count = :count, 
                    detection_confidence = :confidence,
                    last_updated = :now,
                    camera_id = :camera_id
                WHERE classroom_id = :classroom_id
            """)
            db.execute(update_query, {
                "count": count,
                "confidence": confidence,
                "now": now,
                "camera_id": camera_id,
                "classroom_id": classroom_id
            })
        else:
            # 新規作成
            insert_query = text("""
                INSERT INTO occupancy (id, classroom_id, current_count, detection_confidence, last_updated, camera_id)
                VALUES (:id, :classroom_id, :count, :confidence, :now, :camera_id)
            """)
            db.execute(insert_query, {
                "id": f"occ_{classroom_id}",
                "classroom_id": classroom_id,
                "count": count,
                "confidence": confidence,
                "now": now,
                "camera_id": camera_id
            })
            
        # 履歴にも追加
        history_id = f"hist_{classroom_id}_{now.timestamp()}"
        history_query = text("""
            INSERT INTO occupancy_history (id, classroom_id, timestamp, count, detection_confidence, camera_id)
            VALUES (:id, :classroom_id, :timestamp, :count, :confidence, :camera_id)
        """)
        db.execute(history_query, {
            "id": history_id,
            "classroom_id": classroom_id,
            "timestamp": now,
            "count": count,
            "confidence": confidence,
            "camera_id": camera_id
        })
        
        db.commit()
        return True
    except Exception as e:
        logger.error(f"データベース更新エラー: {e}")
        db.rollback()
        return False

def main():
    parser = argparse.ArgumentParser(description="PCカメラから直接DB更新")
    parser.add_argument('--classroom-id', type=str, required=True, help='教室ID')
    parser.add_argument('--camera-id', type=int, default=0, help='カメラID')
    parser.add_argument('--interval', type=int, default=5, help='検出間隔(秒)')
    parser.add_argument('--show-preview', action='store_true', help='プレビュー表示')
    args = parser.parse_args()

    # DBセットアップ
    SessionLocal = setup_database()
    
    # YOLOモデル読み込み
    logger.info("YOLOモデルを読み込んでいます...")
    try:
        model = YOLO('yolov8n.pt')
    except Exception as e:
        logger.error(f"モデル読み込みエラー: {e}")
        return

    # カメラ初期化
    # WindowsではDirectShow (cv2.CAP_DSHOW) を使用すると安定する場合がある
    if os.name == 'nt':
        cap = cv2.VideoCapture(args.camera_id, cv2.CAP_DSHOW)
    else:
        cap = cv2.VideoCapture(args.camera_id)
        
    if not cap.isOpened():
        logger.error(f"カメラを開けませんでした (ID: {args.camera_id})")
        logger.info("ヒント: 他のアプリがカメラを使用していないか確認してください")
        return

    # 解像度設定（オプション）
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    logger.info(f"監視開始: 教室 {args.classroom_id}")
    logger.info("Ctrl+C で終了")

    last_detect_time = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                logger.error("フレーム読み込み失敗")
                time.sleep(1)
                continue

            current_time = time.time()
            
            # プレビュー表示
            if args.show_preview:
                cv2.imshow('Camera Preview', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

            # 指定間隔で検出
            if current_time - last_detect_time >= args.interval:
                # YOLOで検出（人クラス: 0）
                results = model(frame, classes=[0], verbose=False)
                
                # 人数カウント
                person_count = len(results[0].boxes)
                confidence = float(results[0].boxes.conf.mean()) if person_count > 0 else 0.0
                
                logger.info(f"検出: {person_count}人 (信頼度: {confidence:.2f}) -> DB更新")
                
                # DB更新
                db = SessionLocal()
                update_occupancy(db, args.classroom_id, person_count, confidence)
                db.close()
                
                last_detect_time = current_time

            time.sleep(0.1)

    except KeyboardInterrupt:
        logger.info("終了します")
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
