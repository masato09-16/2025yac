# Vercelでのバックエンド動作方法

## 📋 概要

このプロジェクトは**Vercel専用**に最適化されています。Vercelのサーバーレス関数（Python Functions）を使用してバックエンドAPIを提供しています。

**注意**: ローカル環境での動作は想定していません。すべての設定はVercelのサーバーレス環境を前提としています。

## 🔄 動作の流れ

### 1. リクエストの流れ

```
フロントエンド (React SPA)
    ↓
/api/v1/classrooms などのAPIリクエスト
    ↓
Vercelのrewrites設定 (vercel.json)
    ↓
/api/index.py (Vercel Python Function)
    ↓
Mangum (FastAPI → AWS Lambda形式の変換)
    ↓
backend/api/main.py (FastAPIアプリケーション)
    ↓
Supabase PostgreSQL (データベース)
```

### 2. ファイル構成

```
プロジェクトルート/
├── api/
│   ├── index.py          # Vercel関数のエントリーポイント
│   └── requirements.txt  # Python依存関係
├── backend/
│   ├── api/
│   │   ├── main.py       # FastAPIアプリケーション
│   │   └── routes/       # APIエンドポイント
│   ├── database/         # データベースモデル
│   └── config.py        # 設定管理
└── vercel.json           # Vercel設定
```

### 3. vercel.jsonの設定

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.py"
    }
  ],
  "functions": {
    "api/index.py": {
      "includeFiles": "backend/**",
      "maxDuration": 30
    }
  }
}
```

**説明：**
- `/api/*`へのリクエストは`/api/index.py`にルーティングされます
- `includeFiles: "backend/**"`で`backend`ディレクトリ全体が関数に含まれます
- `maxDuration: 30`でタイムアウトを30秒に設定

### 4. api/index.pyの役割

1. **パス解決**: `backend`ディレクトリをPythonパスに追加
2. **環境変数の確認**: `DATABASE_URL`などの設定を確認
3. **FastAPIアプリのインポート**: `backend/api/main.py`から`app`をインポート
4. **Mangumハンドラーの作成**: FastAPIアプリをVercel関数形式に変換

### 5. データベース接続

- **開発環境**: SQLite (`sqlite:///./ynu_classrooms.db`)
- **Vercel環境**: Supabase PostgreSQL (`DATABASE_URL`環境変数から取得)
- 接続プーラー（port 6543）を使用してサーバーレス環境に対応

## 🔧 環境変数の設定

**重要**: 環境変数の詳細な設定方法は `VERCEL_ENV_SETUP.md` を参照してください。

Vercelダッシュボードで以下の**必須**環境変数を設定：

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
SECRET_KEY=強力なランダムキー（32文字以上）
```

**推奨**環境変数：

```env
DEBUG=False
CAMERA_ENABLED=False
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**注意**: 
- `DATABASE_URL`は**ポート6543**（接続プーラー）を使用してください
- 直接接続（port 5432）はサーバーレス環境では動作しません

## 🚀 デプロイの流れ

1. **GitHubにプッシュ** → Vercelが自動検出
2. **ビルド**: `npm run build:client`でフロントエンドをビルド
3. **Python関数の準備**: `api/`ディレクトリ内のファイルを関数として認識
4. **依存関係のインストール**: `api/requirements.txt`から依存関係をインストール
5. **デプロイ**: フロントエンドとAPI関数をデプロイ

## 📍 APIエンドポイント

デプロイ後、以下のエンドポイントが利用可能：

- `https://your-site.vercel.app/api/v1/classrooms` - 教室一覧
- `https://your-site.vercel.app/api/v1/occupancy` - 占有状況
- `https://your-site.vercel.app/api/v1/schedules` - スケジュール
- `https://your-site.vercel.app/api/health` - ヘルスチェック
- `https://your-site.vercel.app/api/docs` - APIドキュメント

## ⚠️ 注意事項

1. **Vercel専用**: このプロジェクトはVercelのサーバーレス環境専用です。ローカル環境での動作は想定していません。
2. **SQLite非対応**: SQLiteは使用できません。PostgreSQL（Supabase）が必須です。
3. **カメラ機能**: Vercel環境では無効化されています（依存関係が大きすぎるため）
4. **データベース**: Supabaseの接続プーラー（port 6543）を使用する必要があります
5. **コールドスタート**: 初回リクエストは数秒かかる場合があります
6. **タイムアウト**: デフォルトで30秒に設定されています
7. **環境変数**: `DATABASE_URL`と`SECRET_KEY`は必須です。設定方法は`VERCEL_ENV_SETUP.md`を参照してください。

## 🐛 トラブルシューティング

### バックエンドが起動しない場合

1. **Vercelの関数ログを確認**:
   - Vercelダッシュボード → Functions → `api/index.py` → View Logs

2. **環境変数を確認**:
   - `DATABASE_URL`が正しく設定されているか
   - 接続プーラー（port 6543）を使用しているか

3. **データベース接続を確認**:
   - Supabaseダッシュボードでデータベースが正常に動作しているか
   - 接続文字列が正しいか

### 教室データが取得できない場合

1. **データベースにデータが存在するか確認**:
   - Supabaseダッシュボード → Table Editor → `classrooms`テーブル

2. **データベースの初期化**:
   - ローカル環境で`python utils/db_init.py`を実行してデータを投入

