# 管理画面が開けない場合のトラブルシューティング

## 🔍 問題の診断と解決方法

### ステップ1: サーバーが起動しているか確認

#### バックエンドの確認

新しいターミナルを開いて：

```bash
cd backend
.\venv\Scripts\Activate.ps1
python -m api.main
```

以下のようなメッセージが表示されれば成功：
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
```

#### フロントエンドの確認

**別の**新しいターミナルを開いて：

```bash
# プロジェクトのルートディレクトリで
npm run dev
```

または

```bash
npx vite
```

以下のようなメッセージが表示されれば成功：
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### ステップ2: ブラウザでアクセス

1. ブラウザを開く（Chrome推奨）
2. アドレスバーに以下を入力：
```
http://localhost:5173/admin
```

### ステップ3: エラーが出る場合の対処法

#### エラー 1: "このサイトにアクセスできません"

**原因**: フロントエンドサーバーが起動していない

**解決方法**:
```bash
# 新しいターミナルで
npm run dev
```

または

```bash
npx vite
```

#### エラー 2: "404 Not Found" または "ページが見つかりません"

**原因**: ルーティングの問題

**解決方法**:
1. サーバーを再起動
```bash
# Ctrl+C でサーバーを停止
npm run dev
```

2. ブラウザのキャッシュをクリア
   - Chrome: Ctrl+Shift+Delete → キャッシュをクリア

#### エラー 3: 白い画面が表示される

**原因**: JavaScriptエラーまたはビルドエラー

**解決方法**:
1. ブラウザの開発者ツールを開く（F12）
2. Consoleタブでエラーを確認
3. エラーメッセージをコピーして共有

#### エラー 4: "Failed to fetch" または API エラー

**原因**: バックエンドが起動していない

**解決方法**:
```bash
# 新しいターミナルで
cd backend
.\venv\Scripts\Activate.ps1
python -m api.main
```

### ステップ4: 完全なリセット

上記で解決しない場合、完全にリセット：

```bash
# 1. すべてのターミナルを閉じる

# 2. 新しいターミナル1 - バックエンド
cd backend
.\venv\Scripts\Activate.ps1
python -m api.main

# 3. 新しいターミナル2 - フロントエンド  
# （プロジェクトルートで）
npm run dev

# 4. ブラウザで開く
# http://localhost:5173/admin
```

### ステップ5: ポート確認

#### ポートが使用中の場合

```bash
# PowerShellで確認
netstat -ano | findstr :5173
```

何か表示されたら、そのポートは使用中です。

**解決方法1**: 別のポートを使う
```bash
npm run dev -- --port 3000
# 次に http://localhost:3000/admin にアクセス
```

**解決方法2**: 使用中のプロセスを終了
1. タスクマネージャーを開く（Ctrl+Shift+Esc）
2. "Node.js" または "vite" を探す
3. タスクを終了

### ステップ6: 依存関係の再インストール

まれに、パッケージの問題が原因のことがあります：

```bash
# node_modules を削除して再インストール
rm -rf node_modules
npm install

# または
rm -rf node_modules
npm ci
```

## 🔧 よくある質問

### Q: "pnpm" コマンドが見つかりません

**A**: pnpm がインストールされていません。npm を使用してください：

```bash
# pnpm の代わりに npm を使う
npm run dev

# または pnpm をインストール
npm install -g pnpm
```

### Q: 管理画面に行くと NotFound ページが表示される

**A**: ルーティングが正しく設定されていません。以下を確認：

1. `client/App.tsx` を確認
2. 以下の行があるか確認：
```typescript
<Route path="/admin" element={<Admin />} />
```

3. `client/pages/Admin.tsx` が存在するか確認

### Q: ブラウザが真っ白

**A**: 
1. F12 で開発者ツールを開く
2. Console タブを確認
3. 赤いエラーメッセージを確認

よくあるエラー：
- "Module not found" → パッケージのインストール不足
- "Unexpected token" → 構文エラー
- "Cannot read property" → 型エラー

### Q: バックエンドのエラー "Address already in use"

**A**: ポート8000が既に使用されています：

```bash
# PowerShellで
netstat -ano | findstr :8000

# プロセスを終了するか、別のポートを使う
uvicorn api.main:app --port 8001
```

フロントエンドで接続先を変更：
```bash
# 環境変数を設定
$env:VITE_API_URL="http://localhost:8001"
npm run dev
```

## 📋 チェックリスト

管理画面にアクセスする前に、以下をすべて確認：

- [ ] バックエンドサーバーが起動している（ポート8000）
- [ ] フロントエンドサーバーが起動している（ポート5173）
- [ ] ターミナルにエラーメッセージが表示されていない
- [ ] ブラウザで `http://localhost:5173` が開ける
- [ ] ブラウザで `http://localhost:5173/admin` にアクセスしている

## 🆘 それでも解決しない場合

以下の情報を共有してください：

1. **ターミナルのエラーメッセージ**（全文）
2. **ブラウザのコンソールエラー**（F12 → Console）
3. **アクセスしようとしているURL**
4. **OSのバージョン**
5. **Node.jsのバージョン** (`node --version`)
6. **npmのバージョン** (`npm --version`)

---

## 🚀 正常に動作している場合の確認方法

### 1. メイン画面が開ける
```
http://localhost:5173
```
→ 空き教室検索画面が表示される

### 2. 管理画面が開ける
```
http://localhost:5173/admin
```
→ 管理画面が表示される

### 3. バックエンドAPIが動作している
```
http://localhost:8000/docs
```
→ FastAPI ドキュメントが表示される

すべて開ければ正常です！✅

