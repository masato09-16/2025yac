"""
経営105教室専用のカメラキャプチャスクリプト

このスクリプトは経営105教室（bus1-105）専用です。
PCカメラからリアルタイムで人数検出を行います。

使用方法:
    python capture_keiei105.py
    
    プレビューウィンドウを表示する場合:
    python capture_keiei105.py --preview

注意: プレビューはローカルのみ表示されます。フロントエンドには表示されません。

このスクリプトは capture_camera.py をラップして、
経営105教室専用に設定を簡略化しています。
"""
import sys
import argparse
from pathlib import Path

# このスクリプトの親ディレクトリをパスに追加
script_dir = Path(__file__).parent
sys.path.insert(0, str(script_dir))

from capture_camera import capture_and_detect

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="経営105教室 リアルタイム人数検出",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
注意: プレビューウィンドウはローカルでのみ表示されます。
フロントエンド（Webアプリ）には表示されません。

使用例:
  # プレビューなしで実行（デフォルト）
  python capture_keiei105.py
  
  # プレビューウィンドウを表示
  python capture_keiei105.py --preview
        """
    )
    
    parser.add_argument(
        '--preview',
        action='store_true',
        help='ローカルでプレビューウィンドウを表示（フロントエンドには表示されません）'
    )
    
    args = parser.parse_args()
    
    # 経営105教室の設定
    CLASSROOM_ID = "bus1-105"
    CAMERA_ID = 0  # デフォルトカメラ
    INTERVAL = 5   # 5秒間隔
    API_URL = "http://localhost:8000"
    SHOW_PREVIEW = args.preview  # コマンドライン引数で制御
    
    print("=" * 60)
    print("経営105教室 リアルタイム人数検出")
    print("=" * 60)
    print(f"教室ID: {CLASSROOM_ID}")
    print(f"カメラ: デバイスID {CAMERA_ID}")
    print(f"検出間隔: {INTERVAL}秒")
    print(f"API URL: {API_URL}")
    print(f"プレビュー: {'有効（ローカルのみ）' if SHOW_PREVIEW else '無効'}")
    if SHOW_PREVIEW:
        print("  → プレビューウィンドウはローカルのみ表示されます")
        print("  → フロントエンドには表示されません")
        print("  → 'q'キーで終了します")
    print("=" * 60)
    print()
    
    capture_and_detect(
        classroom_id=CLASSROOM_ID,
        camera_id=CAMERA_ID,
        interval=INTERVAL,
        api_url=API_URL,
        show_preview=SHOW_PREVIEW
    )


