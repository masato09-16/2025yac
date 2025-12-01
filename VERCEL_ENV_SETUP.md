# Vercel環境変数の設定

このプロジェクトはVercel専用に最適化されています。以下の環境変数をVercelダッシュボードで設定してください。

## 🔧 必須環境変数

### 1. DATABASE_URL

Supabase PostgreSQLの接続文字列（**接続プーラー port 6543を使用**）：

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**重要**: 
- ポートは**6543**（接続プーラー）を使用してください
- 直接接続（port 5432）はサーバーレス環境では動作しません
- `[PROJECT_REF]`はSupabaseプロジェクトの参照IDです
- `[REGION]`はSupabaseプロジェクトのリージョンです（例: `ap-northeast-1`）

**Supabaseでの確認方法**:
1. Supabaseダッシュボード → Project Settings → Database
2. Connection string → Connection pooling → Session mode
3. 接続文字列をコピー（port 6543のものを使用）

### 2. SECRET_KEY

セキュリティのためのランダムな文字列：

```bash
# PowerShellで生成
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

または、オンラインツールで32文字以上のランダム文字列を生成してください。

## 📋 推奨環境変数

### 3. ALLOWED_ORIGINS

CORSで許可するオリジン（カンマ区切り）：

```
https://your-app.vercel.app,https://your-custom-domain.com
```

**注意**: 複数のドメインがある場合は、カンマで区切ってください。

### 4. DEBUG

デバッグモード（通常は`False`）：

```
DEBUG=False
```

### 5. CAMERA_ENABLED

カメラ機能の有効化（Vercelでは`False`推奨）：

```
CAMERA_ENABLED=False
```

**理由**: カメラ関連の依存関係（OpenCV、YOLOなど）が大きすぎてVercelの関数サイズ制限を超えるため。

## 🔐 オプション環境変数

### 6. GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET

Google OAuth認証を使用する場合：

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://2025yac.vercel.app/api/v1/auth/callback
```

**重要**: 
- `GOOGLE_REDIRECT_URI`はバックエンドのコールバックURL（`/api/v1/auth/callback`）
- `FRONTEND_URL`はオプション（デフォルト: `https://2025yac.vercel.app`）
- カスタムドメインを使用する場合のみ、`FRONTEND_URL`を設定してください


### 7. DATABASE_ECHO

SQLクエリのログ出力（デバッグ用、通常は`False`）：

```
DATABASE_ECHO=False
```

## 📝 Vercelでの設定方法

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard
   - プロジェクトを選択

2. **Settings → Environment Variables**
   - 各環境変数を追加
   - Production、Preview、Developmentで設定を分けることができます

3. **環境変数を追加**
   - Key: `DATABASE_URL`
   - Value: Supabase接続文字列（port 6543）
   - 他の環境変数も同様に追加

4. **再デプロイ**
   - 環境変数を追加/変更した後は、再デプロイが必要です
   - Deployments → 最新のデプロイメント → Redeploy

## ✅ 設定確認

デプロイ後、以下のエンドポイントで動作確認：

- `https://your-app.vercel.app/api/health` - ヘルスチェック
- `https://your-app.vercel.app/api/v1/classrooms` - 教室一覧
- `https://your-app.vercel.app/api/docs` - APIドキュメント

## 🚨 よくある問題

### データベース接続エラー

**エラー**: `connection to server at ... port 5432 failed`

**解決策**: 
- `DATABASE_URL`でポート**6543**（接続プーラー）を使用しているか確認
- Supabaseダッシュボードで接続プーラーの接続文字列を確認

### CORSエラー

**エラー**: `Access to fetch at ... has been blocked by CORS policy`

**解決策**:
- `ALLOWED_ORIGINS`にフロントエンドのドメインを追加
- 例: `https://your-app.vercel.app`

### 環境変数が反映されない

**解決策**:
- 環境変数を追加/変更した後、必ず再デプロイ
- Vercelダッシュボードで環境変数が正しく設定されているか確認

