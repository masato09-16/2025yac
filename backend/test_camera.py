"""
カメラとYOLOv8のテストスクリプト

このスクリプトでカメラが正常に動作し、YOLOv8で人数検出ができるか確認します。
"""
import os
import sys
from pathlib import Path

# プロジェクトのルートディレクトリをパスに追加
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from camera.source import CameraSource
from camera.detector import YOLODetector
import cv2
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_camera():
    """カメラのテスト"""
    logger.info("=" * 60)
    logger.info("カメラテストを開始します")
    logger.info("=" * 60)
    
    # 環境変数から設定を取得
    camera_type = os.getenv("CAMERA_TYPE", "pc")
    camera_source = os.getenv("CAMERA_SOURCE", "0")
    
    logger.info(f"カメラタイプ: {camera_type}")
    logger.info(f"カメラソース: {camera_source}")
    
    # カメラテスト
    if CameraSource.test_camera(camera_type, camera_source):
        logger.info("✓ カメラテスト成功")
        return True
    else:
        logger.error("✗ カメラテスト失敗")
        return False


def test_yolo():
    """YOLOv8のテスト"""
    logger.info("=" * 60)
    logger.info("YOLOv8テストを開始します")
    logger.info("=" * 60)
    
    try:
        # YOLOv8検出器を初期化
        detector = YOLODetector(model_path="yolov8n.pt")
        logger.info("✓ YOLOv8モデルの読み込み成功")
        
        # カメラから1フレーム取得してテスト
        camera_type = os.getenv("CAMERA_TYPE", "pc")
        camera_source = os.getenv("CAMERA_SOURCE", "0")
        
        cap = CameraSource.get_camera(camera_type, camera_source)
        
        if not cap.isOpened():
            logger.error("✗ カメラを開けませんでした")
            return False
        
        ret, frame = cap.read()
        cap.release()
        
        if not ret or frame is None:
            logger.error("✗ フレームの読み取りに失敗しました")
            return False
        
        logger.info(f"フレームサイズ: {frame.shape}")
        
        # 人数検出
        person_count, confidence = detector.detect(frame)
        
        logger.info(f"✓ 検出成功 - 人数: {person_count}人, 信頼度: {confidence:.2f}")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ YOLOv8テスト失敗: {e}", exc_info=True)
        return False


def main():
    """メイン関数"""
    logger.info("\n")
    logger.info("🎥 カメラ人数検出システムのテスト")
    logger.info("\n")
    
    # カメラテスト
    camera_ok = test_camera()
    
    if not camera_ok:
        logger.error("\nカメラテストに失敗しました。")
        logger.info("ヒント:")
        logger.info("  - カメラが接続されているか確認してください")
        logger.info("  - 環境変数を設定してください:")
        logger.info("    CAMERA_TYPE=pc CAMERA_SOURCE=0")
        return 1
    
    # YOLOv8テスト
    yolo_ok = test_yolo()
    
    if not yolo_ok:
        logger.error("\nYOLOv8テストに失敗しました。")
        return 1
    
    # 成功
    logger.info("\n")
    logger.info("=" * 60)
    logger.info("✓ すべてのテストが成功しました！")
    logger.info("=" * 60)
    logger.info("\n次のステップ:")
    logger.info("1. FastAPIサーバーを起動:")
    logger.info("   CAMERA_ENABLED=true uvicorn api.main:app --reload")
    logger.info("\n2. カメラキャプチャを実行:")
    logger.info("   python capture_camera.py --classroom-id bus1-105 --show-preview")
    logger.info("\n")
    
    return 0


if __name__ == "__main__":
    exit(main())
