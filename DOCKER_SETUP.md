# 🐳 Docker で YNU-TWIN を起動する方法

Docker を使えば、複雑な環境設定なしで簡単にアプリケーションを起動できます。

## 📋 前提条件

以下がインストールされていることを確認してください：

- **Docker Desktop** for Windows
  - ダウンロード: https://www.docker.com/products/docker-desktop/
  - インストール後、Docker Desktop を起動してください

## 🚀 起動手順（簡単！）

### ステップ1: Docker Desktop を起動

1. Windows のスタートメニューから「Docker Desktop」を起動
2. Docker が起動するまで待つ（右下のアイコンが緑になるまで）

### ステップ2: プロジェクトフォルダを開く

PowerShell または コマンドプロンプトを開いて：

```powershell
cd C:\Users\masat\yac2025-antiaging
```

### ステップ3: Docker コンテナをビルド＆起動

以下のコマンド1つで、すべて自動的に起動します：

```powershell
docker-compose up --build
```

初回は5〜10分ほどかかります（依存関係のダウンロード）。
2回目以降は1〜2分で起動します。

### ステップ4: 起動完了を確認

ターミナルに以下のようなメッセージが表示されたら成功：

```
backend-1   | INFO:     Uvicorn running on http://0.0.0.0:8000
frontend-1  | ➜  Local:   http://localhost:8080/
```

### ステップ5: ブラウザでアクセス

#### ユーザー画面（空き教室検索）
```
http://localhost:8080
```

#### 管理者画面（授業スケジュール管理）
```
http://localhost:8080/ynu-admin-panel-secure-9x7k2m
```

**🔒 セキュリティ重要:**
- このURLは管理者だけが知っておくべきです
- 独自のURLに変更することを強く推奨します
- 詳細は `SECURITY_ADMIN.md` を参照

## 🎉 完了！

これだけで、フロントエンドもバックエンドも起動します。
とても簡単ですね！

---

## ⏹️ 停止方法

### 方法1: Ctrl+C で停止

Docker を実行しているターミナルで：

```
Ctrl + C
```

その後、完全に停止するため：

```powershell
docker-compose down
```

### 方法2: Docker Desktop から停止

1. Docker Desktop を開く
2. 「Containers」タブを開く
3. `yac2025-antiaging` を見つける
4. ■（停止ボタン）をクリック

---

## 🔄 再起動方法

### すでにビルド済みの場合

```powershell
docker-compose up
```

（`--build` は不要です）

### コードを変更した後

```powershell
docker-compose up --build
```

---

## 🧹 クリーンアップ

### すべてのコンテナとイメージを削除

```powershell
# コンテナを停止・削除
docker-compose down

# イメージも削除（ディスク容量を空ける）
docker-compose down --rmi all

# ボリュームも削除（データベースもリセット）
docker-compose down -v
```

---

## 📊 Docker の状態確認

### 起動中のコンテナを確認

```powershell
docker ps
```

以下のようなコンテナが表示されるはず：
- `yac2025-antiaging-frontend-1`
- `yac2025-antiaging-backend-1`

### ログを確認

```powershell
# すべてのログ
docker-compose logs

# フロントエンドのみ
docker-compose logs frontend

# バックエンドのみ
docker-compose logs backend

# リアルタイムでログを表示（-f）
docker-compose logs -f
```

---

## 🔧 トラブルシューティング

### 問題1: "Docker が見つかりません"

**原因**: Docker Desktop がインストールされていない、または起動していない

**解決方法**:
1. Docker Desktop をインストール
2. Docker Desktop を起動
3. 右下のアイコンが緑色になるまで待つ

### 問題2: "ポートが使用中です"

**原因**: 既に他のアプリが同じポートを使用している

**解決方法**:

```powershell
# ポート5173を使っているプロセスを確認
netstat -ano | findstr :5173

# ポート8000を使っているプロセスを確認
netstat -ano | findstr :8000
```

→ タスクマネージャーで該当プロセスを終了

または、docker-compose.yml のポート番号を変更：
```yaml
ports: 
  - "3000:5173"  # 外部からは3000でアクセス
```

### 問題3: "ビルドに失敗しました"

**解決方法**:

```powershell
# キャッシュをクリアして再ビルド
docker-compose build --no-cache
docker-compose up
```

### 問題4: "データベースが見つかりません"

**解決方法**:

データベースを初期化：

```powershell
# バックエンドコンテナに入る
docker-compose exec backend bash

# データベース初期化
python -m utils.db_init

# コンテナから出る
exit
```

### 問題5: コンテナが起動しない

**解決方法**:

```powershell
# すべてクリーンアップして再起動
docker-compose down -v
docker-compose up --build
```

---

## 💡 便利なコマンド

### バックエンドコンテナに入る

```powershell
docker-compose exec backend bash
```

→ データベース操作やログ確認ができます

### フロントエンドコンテナに入る

```powershell
docker-compose exec frontend sh
```

### データベースファイルを確認

```powershell
docker-compose exec backend ls -la *.db
```

### データベースをリセット

```powershell
docker-compose exec backend python -m utils.db_init
```

---

## 🌐 アクセス URL まとめ

| 画面 | URL | 説明 |
|------|-----|------|
| **ユーザー画面** | http://localhost:8080 | 空き教室検索 |
| **管理画面** 🔒 | http://localhost:8080/ynu-admin-panel-secure-9x7k2m | 授業管理（管理者専用・秘密） |
| **API ドキュメント** | http://localhost:8000/docs | FastAPI 自動ドキュメント |
| **API ルート** | http://localhost:8000/api/v1/ | REST API |

**🔒 セキュリティ注意**: 管理画面URLは独自のものに変更してください（`SECURITY_ADMIN.md` 参照）

---

## 📝 Docker vs 手動起動の比較

| 項目 | Docker | 手動起動 |
|------|--------|----------|
| **セットアップ** | 簡単 | 複雑（Python、Node.js、依存関係） |
| **起動コマンド** | 1つ | 2つ（バックエンド＋フロントエンド） |
| **環境の一貫性** | ✅ どのPCでも同じ | ❌ 環境依存 |
| **クリーンアップ** | 簡単 | 手動で削除 |
| **推奨度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 おすすめの使い方

### 開発時（コード編集中）

```powershell
# バックグラウンドで起動
docker-compose up -d

# ログを別ウィンドウで確認
docker-compose logs -f
```

コードを編集すると自動的に反映されます（ホットリロード）。

### デモ・プレゼン時

```powershell
# シンプルに起動
docker-compose up
```

ターミナルを1つだけ開けば OK！

---

## 📞 サポート

問題が解決しない場合は、以下の情報を共有してください：

```powershell
# Docker のバージョン
docker --version
docker-compose --version

# コンテナの状態
docker ps -a

# ログ
docker-compose logs
```

---

**Docker を使えば、たった1コマンドでアプリ全体が起動します！🚀**

