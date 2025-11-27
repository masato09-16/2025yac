# Google認証セットアップガイド

## 概要

YNU-TWINにGoogle認証によるログイン機能、お気に入り機能、検索履歴機能を実装しました。

## 機能

1. **Google OAuth認証**
   - Googleアカウントでログイン
   - セッション管理
   - ユーザー情報の取得

2. **お気に入り機能**
   - 教室をお気に入りに追加/削除
   - お気に入り一覧の表示
   - カードに星アイコンで表示

3. **検索履歴機能**
   - 検索条件の自動保存
   - 検索履歴の表示
   - ワンクリックで再検索

## セットアップ手順

### 1. Google Cloud ConsoleでOAuth認証情報を取得

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth クライアント ID」を選択
5. アプリケーションの種類を「ウェブアプリケーション」に設定
6. 承認済みのリダイレクト URI に以下を追加：
   ```
   http://localhost:8000/api/v1/auth/callback
   ```
   （本番環境の場合は、実際のドメインに変更）
7. クライアント ID と クライアント シークレットをコピー

### 2. 環境変数の設定

`backend/.env` ファイルを作成または編集：

```env
# Google OAuth Settings
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/callback
```

### 3. 依存関係のインストール

```bash
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 4. データベースのマイグレーション

新しいテーブル（users, favorites, search_history）を作成するため、データベースを再初期化：

```bash
cd backend
python -c "from utils.db_init import create_tables; from database.session import Base, engine; Base.metadata.create_all(bind=engine)"
```

または、アプリケーションを起動すると自動的にテーブルが作成されます。

### 5. アプリケーションの起動

```bash
# バックエンド
cd backend
.\venv\Scripts\Activate.ps1
python run.py

# フロントエンド（別のターミナル）
pnpm dev
```

## 使用方法

### ログイン

1. ヘッダーの「ログイン」ボタンをクリック
2. Googleアカウントでログイン
3. 認証後、自動的にアプリに戻ります

### お気に入り機能

1. ログイン後、教室カードの右上に星アイコンが表示されます
2. 星アイコンをクリックして、お気に入りに追加/削除
3. お気に入りに追加された教室は、黄色の星で表示されます

### 検索履歴

1. ログイン後、検索条件が自動的に保存されます
2. 検索履歴は、今後のアップデートで表示機能を追加予定

## API エンドポイント

### 認証

- `GET /api/v1/auth/login` - ログインURLを取得
- `GET /api/v1/auth/callback` - OAuthコールバック
- `GET /api/v1/auth/me?token=...` - 現在のユーザー情報を取得
- `POST /api/v1/auth/logout?token=...` - ログアウト

### お気に入り

- `GET /api/v1/favorites/?token=...` - お気に入り一覧を取得
- `POST /api/v1/favorites/{classroom_id}?token=...` - お気に入りに追加
- `DELETE /api/v1/favorites/{classroom_id}?token=...` - お気に入りから削除
- `GET /api/v1/favorites/check/{classroom_id}?token=...` - お気に入りかどうか確認

### 検索履歴

- `GET /api/v1/search-history/?token=...&limit=20` - 検索履歴を取得
- `POST /api/v1/search-history/?token=...` - 検索履歴を保存
- `DELETE /api/v1/search-history/{history_id}?token=...` - 検索履歴を削除
- `DELETE /api/v1/search-history/?token=...` - 全検索履歴を削除

## 注意事項

1. **セキュリティ**
   - 本番環境では、`GOOGLE_CLIENT_SECRET`を環境変数で管理してください
   - セッションストアは現在メモリ内に保存されています。本番環境ではRedisなどの永続化ストレージを使用することを推奨します

2. **リダイレクトURI**
   - 本番環境では、`GOOGLE_REDIRECT_URI`とGoogle Cloud Consoleの設定を一致させる必要があります

3. **データベース**
   - 既存のデータベースを使用している場合、新しいテーブルが自動的に作成されます

## トラブルシューティング

### ログインできない

- Google Cloud ConsoleでOAuth認証情報が正しく設定されているか確認
- リダイレクトURIが一致しているか確認
- `.env`ファイルの設定を確認

### お気に入りが保存されない

- ログイン状態を確認
- ブラウザのコンソールでエラーを確認
- データベースのテーブルが作成されているか確認

### 検索履歴が保存されない

- ログイン状態を確認
- ネットワークタブでAPIリクエストが成功しているか確認

