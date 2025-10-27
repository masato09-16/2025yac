# YNU Classroom Occupancy Backend

FastAPIベースの教室空き情報管理システムのバックエンドです。

## 機能

- **教室情報管理**: 教室の基本情報（建物、階層、定員、設備など）の管理
- **リアルタイム占有状況**: カメラから取得した人数データに基づく占有状況の管理
- **履歴データ**: 過去の占有状況の記録と分析
- **RESTful API**: フロントエンドとの連携用API

## プロジェクト構造

```
backend/
├── api/                  # FastAPI アプリケーション
│   ├── main.py          # メインアプリ
│   ├── routes/          # APIエンドポイント
│   │   ├── classrooms.py
│   │   └── occupancy.py
│   └── models/          # Pydantic models
│       ├── classroom.py
│       └── occupancy.py
├── camera/              # カメラ・画像処理
│   ├── detector.py      # 人数検出
│   └── processor.py     # 画像処理パイプライン
├── database/            # データベース関連
│   ├── session.py       # DBセッション管理
│   └── models/          # SQLAlchemy models
│       ├── classroom.py
│       └── occupancy.py
├── utils/               # ユーティリティ
│   └── db_init.py       # DB初期化・シード
├── config.py            # 設定管理
├── requirements.txt     # 依存関係
└── README.md
```

## セットアップ

### 1. 仮想環境の作成とアクティベート

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 3. 環境変数の設定

`.env`ファイルを作成し、以下の設定を行います：

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ynu_classrooms
DATABASE_ECHO=False
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
CAMERA_ENABLED=True
CAMERA_UPDATE_INTERVAL=5
```

### 4. データベースの初期化

```bash
python utils/db_init.py
```

これにより、テーブルが作成され、シードデータが投入されます。

### 5. アプリケーションの起動

```bash
# 開発モード
python -m api.main

# または
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

## API エンドポイント

### 教室管理

- `GET /api/v1/classrooms` - すべての教室を取得
- `GET /api/v1/classrooms/{id}` - 特定の教室を取得
- `POST /api/v1/classrooms` - 新規教室を作成
- `PUT /api/v1/classrooms/{id}` - 教室を更新
- `DELETE /api/v1/classrooms/{id}` - 教室を削除

### 占有状況

- `GET /api/v1/occupancy` - すべての占有状況を取得
- `GET /api/v1/occupancy/classroom/{id}` - 特定教室の占有状況
- `GET /api/v1/occupancy/classrooms-with-status` - 教室と占有状況を一緒に取得
- `POST /api/v1/occupancy/update` - 占有状況を更新

## カメラ統合

カメラからの人数検出は以下の流れで動作します：

1. カメラ映像をキャプチャ
2. OpenCVを使用して人物検出
3. 検出結果をデータベースに保存
4. フロントエンドにリアルタイムで反映

## 開発

### コードフォーマット

```bash
black backend/
ruff check backend/ --fix
```

### テスト

```bash
pytest
```

## デプロイ

本番環境では、以下の設定を推奨：

1. `DEBUG=False`
2. 強力な `SECRET_KEY` の設定
3. HTTPS の有効化
4. データベースのバックアップ設定
5. ログ監視の実装

