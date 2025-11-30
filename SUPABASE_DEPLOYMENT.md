# Supabase + Netlify/Vercel デプロイガイド

本番環境でのデプロイ手順です。Supabase（PostgreSQL）をデータベースとして使用し、NetlifyまたはVercelにデプロイします。

## 🤔 NetlifyとVercel、どちらを選ぶべき？

### 比較表

| 項目 | Netlify | Vercel |
|------|---------|--------|
| **無料枠** | 100GB帯域幅/月、300分ビルド時間/月 | 100GB帯域幅/月、100時間関数実行/月 |
| **Python Functions** | ✅ 対応（3.11） | ✅ 対応（3.11） |
| **デプロイ速度** | 速い | 非常に速い |
| **設定の簡単さ** | 簡単 | 簡単 |
| **エッジ関数** | 対応 | 強力（グローバル分散） |
| **静的サイト** | 非常に強い | 強い |
| **ドキュメント** | 充実 | 充実 |
| **コミュニティ** | 大きい | 大きい |

### 推奨

**このプロジェクトの場合、どちらでも問題なく動作します。** 以下の点を考慮してください：

#### Netlifyを選ぶ場合
- ✅ より多くの無料ビルド時間が必要
- ✅ 静的サイトホスティングに特化した機能が必要
- ✅ シンプルな設定を好む

#### Vercelを選ぶ場合
- ✅ より高速なデプロイが必要
- ✅ エッジ関数のグローバル分散が必要
- ✅ Next.jsなどのVercel最適化フレームワークを使用している（このプロジェクトは該当なし）

### 結論

**初めてのデプロイなら、Netlifyを推奨します。**
- 設定がより直感的
- 無料枠のビルド時間が多く、学習コストが低い
- このプロジェクトの要件（FastAPI + React）を十分に満たす

ただし、Vercelも全く問題なく動作します。既にアカウントがある場合は、どちらでも構いません。

## 📋 前提条件

- Supabaseアカウント（無料で作成可能）
- NetlifyまたはVercelアカウント
- GitHubリポジトリ（推奨）

## 🗄️ ステップ1: Supabaseのセットアップ

### 1.1 Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 「New Project」をクリック
3. プロジェクト情報を入力：
   - **Name**: `ynu-classrooms`（任意）
   - **Database Password**: 強力なパスワードを設定（後で使用します）
   - **Region**: 最寄りのリージョンを選択

### 1.2 データベース接続情報の取得

1. Supabaseダッシュボードでプロジェクトを開く
2. 左メニューから「Settings」→「Database」を選択
3. 「Connection string」セクションで「URI」をコピー
   - 形式: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - または「Session mode」の接続文字列を使用

### 1.3 データベーススキーマの初期化

ローカル環境でSupabaseに接続してスキーマを作成：

**Windows PowerShellの場合：**

```powershell
cd backend

# 環境変数を設定（PowerShell構文）
$env:DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# データベースを初期化
python utils/db_init.py
```

**Linux/Macの場合：**

```bash
cd backend


# 環境変数を設定
export DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# データベースを初期化
python utils/db_init.py
```

**または、`.env`ファイルを使用（推奨）：**

`backend/.env`ファイルを作成：

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

その後、通常通り実行：

```bash
python utils/db_init.py
```

これにより、必要なテーブルが作成され、シードデータが投入されます。

## 🚀 ステップ2: Netlifyへのデプロイ

### 2.1 環境変数の設定

Netlifyダッシュボードで以下を設定：

1. プロジェクトの「Site settings」→「Environment variables」を開く
2. 以下の環境変数を追加：

```env
# データベース接続（Supabase）
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# API設定
DEBUG=False
SECRET_KEY=強力なランダムキーを生成（openssl rand -hex 32）

# カメラ設定（本番環境では通常False）
CAMERA_ENABLED=False

# フロントエンド設定
VITE_API_URL=https://your-site.netlify.app
VITE_POLLING_INTERVAL=30000  # 30秒（本番環境推奨）
```

### 2.2 デプロイ

1. GitHubリポジトリをNetlifyに接続
2. ビルド設定：
   - **Build command**: `npm run build:client`
   - **Publish directory**: `dist/spa`
3. 「Deploy site」をクリック

### 2.3 関数のデプロイ

Netlify Functionsは自動的に`netlify/functions/`ディレクトリからデプロイされます。

**注意**: Pythonランタイムが必要なため、`netlify.toml`で設定済みです。

## 🚀 ステップ3: Vercelへのデプロイ

### 3.1 環境変数の設定

Vercelダッシュボードで以下を設定：

1. プロジェクトの「Settings」→「Environment Variables」を開く
2. 以下の環境変数を追加（Netlifyと同じ）：

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
DEBUG=False
SECRET_KEY=強力なランダムキー
CAMERA_ENABLED=False
VITE_API_URL=https://your-site.vercel.app
VITE_POLLING_INTERVAL=30000
```

### 3.2 デプロイ

1. GitHubリポジトリをVercelに接続
2. プロジェクト設定：
   - **Framework Preset**: Other
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `dist/spa`
3. 「Deploy」をクリック

### 3.3 関数のデプロイ

Vercel Functionsは`api/`ディレクトリから自動的にデプロイされます。

`vercel.json`で設定済みです。

## 🔧 ステップ4: CORS設定の更新

本番環境のドメインをCORS設定に追加：

`backend/config.py`を編集：

```python
allowed_origins: List[str] = [
    "http://localhost:8080",
    "http://localhost:3000",
    "https://your-site.netlify.app",  # Netlifyの場合
    "https://your-site.vercel.app",   # Vercelの場合
]
```

または環境変数で設定：

```env
ALLOWED_ORIGINS=https://your-site.netlify.app,https://your-site.vercel.app
```

## 📊 ステップ5: 動作確認

### 5.1 ヘルスチェック

```
https://your-site.netlify.app/api/health
```

または

```
https://your-site.vercel.app/api/health
```

### 5.2 APIドキュメント

```
https://your-site.netlify.app/api/docs
```

### 5.3 フロントエンド

```
https://your-site.netlify.app
```

## 🔒 セキュリティチェックリスト

- [ ] `DEBUG=False`に設定
- [ ] 強力な`SECRET_KEY`を設定
- [ ] Supabaseのデータベースパスワードを強力に設定
- [ ] 環境変数をGitにコミットしていない（`.gitignore`に`.env`が含まれている）
- [ ] CORS設定で本番ドメインのみ許可
- [ ] HTTPSが有効になっている（Netlify/Vercelは自動）

## 🐛 トラブルシューティング

### データベース接続エラー

```
Error: could not connect to server
```

**解決策:**
- Supabaseの接続文字列を確認
- パスワードが正しいか確認
- SupabaseのIP制限設定を確認（必要に応じて無効化）

### 関数がデプロイされない

**解決策:**
- `netlify.toml`（Netlify）または`vercel.json`（Vercel）の設定を確認
- Pythonランタイムが正しく設定されているか確認
- ビルドログを確認

### ポーリングが頻繁すぎる

**解決策:**
- `VITE_POLLING_INTERVAL`を増やす（例: `60000` = 60秒）
- 本番環境では30秒以上を推奨

## 📚 関連ドキュメント

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Vercel Functions](https://vercel.com/docs/functions)
- [環境変数設定ガイド](ENV_SETUP.md)

## 💡 次のステップ

- [ ] WebSocketによるリアルタイム更新（ポーリングから移行）
- [ ] Redisキャッシングの追加
- [ ] 監視とアラートの設定
- [ ] バックアップの自動化

