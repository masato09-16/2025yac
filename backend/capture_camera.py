"""
PCカメラからリアルタイムで人数検出を行うスクリプト

ラズベリーパイでも同じAPIを使用できるように設計されています。
PCカメラを使用する場合は、このスクリプトを使用してください。

使用方法:
    python capture_camera.py --classroom-id bus1-105

オプション:
    --classroom-id: 教室ID（必須）
    --camera-id: カメラデバイスID（デフォルト: 0）
    --interval: 検出間隔（秒）（デフォルト: 5）
    --api-url: APIのベースURL（デフォルト: http://localhost:8000）
    --show-preview: プレビューウィンドウを表示（デフォルト: False）
"""
import argparse
import time
import requests
import cv2
import numpy as np
from pathlib import Path
from typing import Optional
import logging
from io import BytesIO

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def capture_and_detect(
    classroom_id: str,
    camera_id: int = 0,
    interval: int = 5,
    api_url: str = "http://localhost:8000",
    show_preview: bool = False
):
    """
    PCカメラから画像をキャプチャして人数検出APIを呼び出す
    
    Args:
        classroom_id: 教室ID
        camera_id: カメラデバイスID
        interval: 検出間隔（秒）
        api_url: APIのベースURL
        show_preview: プレビューウィンドウを表示するか
    """
    logger.info(f"カメラ初期化中: デバイスID {camera_id}")
    
    # カメラを開く
    cap = cv2.VideoCapture(camera_id)
    
    if not cap.isOpened():
        logger.error(f"カメラを開けませんでした: デバイスID {camera_id}")
        logger.info("ヒント: カメラが接続されているか確認してください。別のカメラIDを試す場合は --camera-id オプションを使用してください。")
        return
    
    # カメラの解像度を設定（オプション）
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    logger.info(f"教室ID: {classroom_id}")
    logger.info(f"検出間隔: {interval}秒")
    logger.info(f"API URL: {api_url}")
    logger.info(f"プレビュー: {'有効' if show_preview else '無効'}")
    logger.info("=" * 60)
    logger.info("人数検出を開始します。Ctrl+Cで終了します。")
    logger.info("=" * 60)
    
    try:
        frame_count = 0
        last_detect_time = time.time() - interval  # 初回実行を保証
        
        while True:
            current_time = time.time()
            
            # フレームを読み取る
            ret, frame = cap.read()
            
            if not ret:
                logger.error("フレームを読み取れませんでした")
                time.sleep(1)
                continue
            
            frame_count += 1
            
            # プレビューを表示（オプション）
            if show_preview:
                preview_frame = frame.copy()
                cv2.putText(
                    preview_frame,
                    f"Frame: {frame_count}",
                    (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0, 255, 0),
                    2
                )
                cv2.putText(
                    preview_frame,
                    f"Next detect in: {max(0, interval - (current_time - last_detect_time)):.1f}s",
                    (10, 70),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (255, 255, 0),
                    2
                )
                cv2.imshow('Camera Preview', preview_frame)
                
                # 'q'キーで終了
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    logger.info("プレビューを閉じて終了します。")
                    break
            
            # 指定間隔で検出を実行
            if current_time - last_detect_time >= interval:
                # 画像をJPEG形式にエンコード
                _, img_encoded = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                
                # バイトデータに変換
                img_bytes = img_encoded.tobytes()
                
                # APIに送信
                success = send_image_to_api(
                    img_bytes,
                    classroom_id,
                    api_url
                )
                
                last_detect_time = current_time
                
                if success:
                    logger.info(f"次の検出まで {interval}秒待機します...")
            
            # 短い待機時間（CPU使用率を下げる）
            time.sleep(0.1)
                
    except KeyboardInterrupt:
        logger.info("\n人数検出を終了します。")
    except Exception as e:
        logger.error(f"エラーが発生しました: {e}", exc_info=True)
    finally:
        cap.release()
        if show_preview:
            cv2.destroyAllWindows()
        logger.info("カメラを解放しました。")


def send_image_to_api(
    image_bytes: bytes,
    classroom_id: str,
    api_url: str = "http://localhost:8000"
) -> bool:
    """
    画像をAPIエンドポイントに送信
    
    Args:
        image_bytes: 画像のバイトデータ
        classroom_id: 教室ID
        api_url: APIのベースURL
        
    Returns:
        成功した場合True、失敗した場合False
    """
    try:
        url = f"{api_url}/api/v1/camera/detect"
        
        files = {'file': ('image.jpg', BytesIO(image_bytes), 'image/jpeg')}
        data = {'classroom_id': classroom_id}
        
        logger.info(f"画像を送信しています... -> 教室ID: {classroom_id}")
        response = requests.post(url, files=files, data=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            logger.info(
                f"✓ 検出成功 - 教室ID: {result['classroom_id']}, "
                f"人数: {result['person_count']}人, "
                f"信頼度: {result['confidence']:.2f}"
            )
            if result.get('image_url'):
                logger.info(f"  解析結果画像: {api_url}{result['image_url']}")
            return True
        else:
            logger.error(f"✗ 送信失敗 - ステータスコード: {response.status_code}, レスポンス: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        logger.error(f"✗ APIサーバーに接続できません: {api_url}")
        logger.info("ヒント: FastAPIサーバーが起動しているか確認してください")
        return False
    except Exception as e:
        logger.error(f"✗ エラーが発生しました: {e}")
        return False


def main():
    """メイン関数"""
    parser = argparse.ArgumentParser(
        description="PCカメラからリアルタイムで人数検出",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # 経営105教室で人数検出（5秒間隔）
  python capture_camera.py --classroom-id bus1-105
  
  # 10秒間隔で検出
  python capture_camera.py --classroom-id bus1-105 --interval 10
  
  # プレビューウィンドウを表示
  python capture_camera.py --classroom-id bus1-105 --show-preview
  
  # 別のカメラデバイスを使用
  python capture_camera.py --classroom-id bus1-105 --camera-id 1
        """
    )
    
    parser.add_argument(
        '--classroom-id',
        type=str,
        required=True,
        help='教室ID（必須）'
    )
    
    parser.add_argument(
        '--camera-id',
        type=int,
        default=0,
        help='カメラデバイスID（デフォルト: 0）'
    )
    
    parser.add_argument(
        '--interval',
        type=int,
        default=5,
        help='検出間隔（秒）デフォルト: 5'
    )
    
    parser.add_argument(
        '--api-url',
        type=str,
        default='http://localhost:8000',
        help='APIのベースURL（デフォルト: http://localhost:8000）'
    )
    
    parser.add_argument(
        '--show-preview',
        action='store_true',
        help='プレビューウィンドウを表示'
    )
    
    args = parser.parse_args()
    
    # 人数検出を実行
    capture_and_detect(
        classroom_id=args.classroom_id,
        camera_id=args.camera_id,
        interval=args.interval,
        api_url=args.api_url,
        show_preview=args.show_preview
    )


if __name__ == "__main__":
    main()

