# YNU Classroom Occupancy System - Backend

FastAPIベースのリアルタイム教室空き情報管理システムのバックエンドです。

## 📁 プロジェクト構造

```
backend/
├── api/                    # FastAPI アプリケーション
│   ├── main.py            # メインアプリ（エントリーポイント）
│   ├── routes/            # APIエンドポイント
│   │   ├── classrooms.py  # 教室管理API
│   │   └── occupancy.py   # 占有状況管理API
│   └── models/            # Pydantic models（リクエスト/レスポンス）
│       ├── classroom.py
│       └── occupancy.py
├── camera/                # カメラ・画像処理システム
│   ├── detector.py        # 人数検出エンジン（OpenCV HOG）
│   └── processor.py       # カメラ処理パイプライン
├── database/              # データベース層
│   ├── session.py         # DBセッション管理
│   └── models/            # SQLAlchemy models
│       ├── classroom.py   # 教室モデル
│       └── occupancy.py   # 占有状況モデル
├── data/                  # シードデータ
│   └── classrooms.py       # 教室データ
├── utils/                 # ユーティリティ
│   └── db_init.py         # DB初期化・シード実行
├── config.py              # アプリケーション設定
├── requirements.txt       # Python依存関係
├── run.py                 # 起動スクリプト
└── README.md              # バックエンド専用README
```

## 🚀 クイックスタート

### 1. 環境セットアップ

```bash
# 仮想環境を作成
python -m venv venv

# 仮想環境を有効化
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 依存関係をインストール
pip install -r requirements.txt
```

### 2. データベース設定

`.env`ファイルを作成：

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ynu_classrooms
DEBUG=True
CAMERA_ENABLED=True
```

### 3. データベースの初期化

```bash
python utils/db_init.py
```

### 4. アプリケーションの起動

```bash
# 開発モード（ホットリロード有効）
python run.py

# または
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. APIドキュメントの確認

ブラウザで以下にアクセス：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🎯 主要機能

### 1. 教室管理 API

- **GET** `/api/v1/classrooms` - 全教室を取得
  - フィルター: `faculty`, `building_id`, `floor`
  
- **GET** `/api/v1/classrooms/{id}` - 特定の教室を取得

- **POST** `/api/v1/classrooms` - 新規教室を作成

- **PUT** `/api/v1/classrooms/{id}` - 教室を更新

- **DELETE** `/api/v1/classrooms/{id}` - 教室を削除

### 2. 占有状況 API

- **GET** `/api/v1/occupancy` - 全占有状況を取得
  - フィルター: `faculty`, `building_id`, `available_only`

- **GET** `/api/v1/occupancy/classroom/{id}` - 特定教室の占有状況

- **GET** `/api/v1/occupancy/classrooms-with-status` - 教室と占有状況を一緒に取得

- **POST** `/api/v1/occupancy/update` - 占有状況を更新
  ```json
  {
    "classroom_id": "edu6-101",
    "current_count": 5,
    "detection_confidence": 0.95,
    "camera_id": "cam-001"
  }
  ```

## 📷 カメラ統合

### 人数検出フロー

1. **キャプチャ**: カメラ映像を取得
2. **検出**: OpenCV HOG (Histogram of Oriented Gradients) を使用
3. **更新**: 検出結果をデータベースに保存
4. **リアルタイム**: フロントエンドに反映

### 使用例

```python
from camera.processor import CameraProcessor

processor = CameraProcessor()
await processor.update_classroom_occupancy(
    classroom_id="edu6-101",
    camera_url="rtsp://camera-url",
)
```

## 🗄️ データベース設計

### classrooms (教室)
- `id`: 一意の教室ID
- `room_number`: 教室番号
- `building_id`: 建物ID
- `faculty`: 学部
- `floor`: 階数
- `capacity`: 定員
- `has_projector`, `has_wifi`, `has_power_outlets`: 設備

### occupancy (占有状況)
- `id`: 一意のID
- `classroom_id`: 教室ID (FK)
- `current_count`: 現在の人数
- `detection_confidence`: 検出信頼度
- `last_updated`: 最終更新時刻
- `camera_id`: カメラID

### occupancy_history (占有履歴)
- 過去の占有状況を時系列で記録

## 🛠️ 開発

### コードフォーマット

```bash
black backend/
ruff check backend/ --fix
```

### テスト

```bash
pytest backend/tests/
```

### ログ

```python
import logging
logger = logging.getLogger(__name__)
logger.info("Your log message")
```

## 📝 次のステップ

1. **カメラ実装**: 実際のカメラストリームと統合
2. **リアルタイム更新**: WebSocket または Server-Sent Events
3. **認証**: JWT ベースの認証システム
4. **監視**: Prometheus + Grafana でメトリクス収集
5. **最適化**: 検出精度の向上（YOLO等）

## 🔒 セキュリティ

- API認証の実装
- カメラストリームの暗号化
- データベース接続のセキュア化
- 入力値のバリデーション

## 📧 サポート

詳細は `backend/README.md` を参照してください。

