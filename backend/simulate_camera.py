"""
ラズベリーパイからの画像送信をシミュレートするスクリプト

このスクリプトは、sample_images/ ディレクトリ内の画像を読み込み、
APIエンドポイントにPOST送信することで、仮想ラズパイとして機能します。

使用方法:
    python simulate_camera.py

オプション:
    --interval: 送信間隔（秒）デフォルト: 5
    --random: ランダムに画像を選択（デフォルト: 順番に）
    --classroom-id: 特定の教室IDを指定（デフォルト: ランダム）
    --api-url: APIのベースURL（デフォルト: http://localhost:8000）
"""
import argparse
import time
import random
import requests
from pathlib import Path
from typing import List, Optional
import logging

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# サポートされている画像形式
SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp'}

# サンプル教室IDリスト（実際のデータから取得）
from data.classrooms import ALL_CLASSROOMS
CLASSROOM_IDS = [c['id'] for c in ALL_CLASSROOMS]


def get_classroom_image_files(sample_dir: Path, classroom_id: str) -> List[Path]:
    """
    指定教室IDのフォルダから画像ファイルのリストを取得
    
    Args:
        sample_dir: サンプル画像のルートディレクトリ
        classroom_id: 教室ID
        
    Returns:
        画像ファイルのパスのリスト
    """
    classroom_dir = sample_dir / classroom_id
    
    if not classroom_dir.exists():
        logger.warning(f"教室フォルダが存在しません: {classroom_dir}")
        logger.info(f"ヒント: sample_images/{classroom_id}/ ディレクトリを作成して画像を配置してください")
        return []
    
    if not classroom_dir.is_dir():
        logger.warning(f"教室フォルダがディレクトリではありません: {classroom_dir}")
        return []
    
    image_files = [
        f for f in classroom_dir.iterdir()
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
    ]
    
    if not image_files:
        logger.warning(f"画像ファイルが見つかりません: {classroom_dir}")
        logger.info(f"ヒント: sample_images/{classroom_id}/ ディレクトリに画像ファイル（.jpg, .png等）を配置してください")
    
    return sorted(image_files)


def get_all_classroom_dirs(sample_dir: Path) -> List[str]:
    """
    サンプル画像ディレクトリ内のすべての教室フォルダ（教室ID）を取得
    
    Args:
        sample_dir: サンプル画像のルートディレクトリ
        
    Returns:
        教室IDのリスト
    """
    if not sample_dir.exists():
        return []
    
    classroom_ids = [
        d.name for d in sample_dir.iterdir()
        if d.is_dir() and not d.name.startswith('.')
    ]
    
    return sorted(classroom_ids)


def send_image_to_api(
    image_path: Path,
    classroom_id: str,
    api_url: str = "http://localhost:8000"
) -> bool:
    """
    画像をAPIエンドポイントに送信
    
    Args:
        image_path: 送信する画像ファイルのパス
        classroom_id: 教室ID
        api_url: APIのベースURL
        
    Returns:
        成功した場合True、失敗した場合False
    """
    try:
        url = f"{api_url}/api/v1/camera/detect"
        
        with open(image_path, 'rb') as f:
            files = {'file': (image_path.name, f, 'image/jpeg')}
            data = {'classroom_id': classroom_id}
            
            logger.info(f"画像を送信しています: {image_path.name} -> 教室ID: {classroom_id}")
            response = requests.post(url, files=files, data=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                logger.info(
                    f"✓ 送信成功 - 教室ID: {result['classroom_id']}, "
                    f"人数: {result['person_count']}, "
                    f"信頼度: {result['confidence']:.2f}, "
                    f"画像URL: {result['image_url']}"
                )
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


def simulate_raspberry_pi(
    sample_dir: Path,
    interval: int = 5,
    random_mode: bool = False,
    classroom_id: Optional[str] = None,
    api_url: str = "http://localhost:8000"
):
    """
    ラズベリーパイのシミュレーションを実行
    
    Args:
        sample_dir: サンプル画像が格納されているディレクトリ（教室IDごとのフォルダを含む）
        interval: 送信間隔（秒）
        random_mode: ランダムモード（True: ランダムに選択、False: 順番に）
        classroom_id: 固定の教室ID（Noneの場合は利用可能な教室から選択）
        api_url: APIのベースURL
    """
    # 利用可能な教室IDを取得
    available_classroom_ids = get_all_classroom_dirs(sample_dir)
    
    if not available_classroom_ids:
        logger.error("教室フォルダが見つかりません。終了します。")
        logger.info(f"ヒント: sample_images/ ディレクトリに教室IDごとのフォルダ（例: sample_images/edu6-101/）を作成してください")
        return
    
    # 固定の教室IDが指定されている場合、その教室の画像を確認
    if classroom_id:
        if classroom_id not in available_classroom_ids:
            logger.error(f"指定された教室ID '{classroom_id}' のフォルダが見つかりません。")
            logger.info(f"利用可能な教室ID: {', '.join(available_classroom_ids)}")
            return
        
        image_files = get_classroom_image_files(sample_dir, classroom_id)
        if not image_files:
            logger.error(f"教室 '{classroom_id}' に画像ファイルが見つかりません。終了します。")
            return
        
        logger.info(f"教室ID: {classroom_id}")
        logger.info(f"見つかった画像ファイル数: {len(image_files)}")
    else:
        # 各教室の画像ファイル数を確認
        classroom_image_counts = {}
        for cid in available_classroom_ids:
            images = get_classroom_image_files(sample_dir, cid)
            if images:
                classroom_image_counts[cid] = images
        
        if not classroom_image_counts:
            logger.error("どの教室にも画像ファイルが見つかりません。終了します。")
            return
        
        logger.info(f"利用可能な教室数: {len(classroom_image_counts)}")
        total_images = sum(len(images) for images in classroom_image_counts.values())
        logger.info(f"合計画像ファイル数: {total_images}")
    
    logger.info(f"送信間隔: {interval}秒")
    logger.info(f"モード: {'ランダム' if random_mode else '順番'}")
    logger.info(f"API URL: {api_url}")
    logger.info("=" * 60)
    
    # 各教室の画像ファイルを保持する辞書
    classroom_images: dict[str, List[Path]] = {}
    classroom_indices: dict[str, int] = {}
    
    # 固定の教室IDが指定されている場合
    if classroom_id:
        classroom_images[classroom_id] = get_classroom_image_files(sample_dir, classroom_id)
        classroom_indices[classroom_id] = 0
    else:
        # すべての教室の画像を読み込む
        for cid in available_classroom_ids:
            images = get_classroom_image_files(sample_dir, cid)
            if images:
                classroom_images[cid] = images
                classroom_indices[cid] = 0
    
    try:
        while True:
            # 教室IDを選択
            if classroom_id:
                target_classroom_id = classroom_id
            else:
                # 利用可能な教室からランダムに選択
                target_classroom_id = random.choice(list(classroom_images.keys()))
            
            # その教室の画像ファイルを選択
            image_files = classroom_images[target_classroom_id]
            
            if random_mode:
                image_path = random.choice(image_files)
            else:
                # 順番に選択
                index = classroom_indices[target_classroom_id]
                image_path = image_files[index % len(image_files)]
                classroom_indices[target_classroom_id] = (index + 1) % len(image_files)
            
            # 画像を送信
            send_image_to_api(image_path, target_classroom_id, api_url)
            
            # 待機
            logger.info(f"次の送信まで {interval}秒待機します...")
            time.sleep(interval)
            
    except KeyboardInterrupt:
        logger.info("\nシミュレーションを終了します。")


def main():
    """メイン関数"""
    parser = argparse.ArgumentParser(
        description="ラズベリーパイからの画像送信をシミュレート",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # デフォルト設定で実行（5秒間隔、順番に送信）
  python simulate_camera.py
  
  # 10秒間隔でランダムに送信
  python simulate_camera.py --interval 10 --random
  
  # 特定の教室IDを指定
  python simulate_camera.py --classroom-id edu6-101
  
  # カスタムAPI URL
  python simulate_camera.py --api-url http://localhost:8000
        """
    )
    
    parser.add_argument(
        '--interval',
        type=int,
        default=5,
        help='送信間隔（秒）デフォルト: 5'
    )
    
    parser.add_argument(
        '--random',
        action='store_true',
        help='ランダムに画像を選択（デフォルト: 順番に）'
    )
    
    parser.add_argument(
        '--classroom-id',
        type=str,
        default=None,
        help='特定の教室IDを指定（デフォルト: ランダム）'
    )
    
    parser.add_argument(
        '--api-url',
        type=str,
        default='http://localhost:8000',
        help='APIのベースURL（デフォルト: http://localhost:8000）'
    )
    
    parser.add_argument(
        '--sample-dir',
        type=str,
        default='sample_images',
        help='サンプル画像ディレクトリ（デフォルト: sample_images）'
    )
    
    args = parser.parse_args()
    
    # サンプル画像ディレクトリのパス
    sample_dir = Path(args.sample_dir)
    if not sample_dir.is_absolute():
        # 相対パスの場合、このスクリプトのディレクトリを基準にする
        script_dir = Path(__file__).parent
        sample_dir = script_dir / args.sample_dir
    
    # シミュレーション実行
    simulate_raspberry_pi(
        sample_dir=sample_dir,
        interval=args.interval,
        random_mode=args.random,
        classroom_id=args.classroom_id,
        api_url=args.api_url
    )


if __name__ == "__main__":
    main()

