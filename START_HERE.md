# 🚀 YNU-TWIN クイックスタート

## 管理画面を開くための最短手順

### 🐳 方法1: Docker で起動（推奨・超簡単！）

#### 必要なもの
- Docker Desktop（まだない場合: https://www.docker.com/products/docker-desktop/ ）

#### 起動手順（たった2ステップ！）

**1. PowerShell を開いて、プロジェクトフォルダへ移動**
```powershell
cd C:\Users\masat\yac2025-antiaging
```

**2. 起動コマンドを実行**
```powershell
docker-compose up --build
```

初回は5〜10分かかりますが、待つだけです！

**3. ブラウザで開く**

起動完了メッセージが出たら：

```
✅ ユーザー画面: http://localhost:8080
✅ 管理画面:     http://localhost:8080/ynu-admin-panel-secure-9x7k2m
```

**⚠️ セキュリティ注意**: 管理画面のURLは秘密にしてください！
独自のURLに変更することを推奨します（SECURITY_ADMIN.md 参照）

**それだけ！** これで管理画面が開きます。

#### 停止方法
```
Ctrl + C
```
その後：
```powershell
docker-compose down
```

---

### 💻 方法2: 手動起動（Dockerなし）

#### 必要なもの
- Python 3.13
- Node.js

#### 起動手順

**ターミナル1（バックエンド）:**
```powershell
cd C:\Users\masat\yac2025-antiaging\backend
.\venv\Scripts\Activate.ps1
python -m api.main
```

**ターミナル2（フロントエンド）:**
```powershell
cd C:\Users\masat\yac2025-antiaging
npm install
npm run dev
```

**ブラウザで開く:**
```
http://localhost:8080/ynu-admin-panel-secure-9x7k2m
```

**🔒 セキュリティ**: このURLは推測困難な形式です。
独自のURLに変更する方法は `SECURITY_ADMIN.md` を参照してください。

---

## 🎯 管理画面でできること

- ✅ 授業スケジュールの追加
- ✅ 授業スケジュールの編集
- ✅ 授業スケジュールの削除
- ✅ 曜日別の一覧表示

---

## 📚 詳細ガイド

| ガイド | 説明 |
|--------|------|
| **DOCKER_SETUP.md** | Dockerの詳しい使い方 |
| **SCHEDULE_MANAGEMENT.md** | 授業管理の詳細 |
| **ADMIN_ACCESS.md** | 管理画面のアクセス方法 |
| **TROUBLESHOOTING_ADMIN.md** | 問題が起きた時の解決方法 |

---

## ❓ よくある質問

### Q: どちらの方法がおすすめ？

**A:** Docker（方法1）が断然おすすめです！
- コマンド1つで起動
- 環境の違いを気にしなくていい
- クリーンアップも簡単

### Q: 管理画面のURLは？

**A:** 
```
http://localhost:8080/ynu-admin-panel-secure-9x7k2m
```

**🔒 セキュリティ重要:**
- このURLは秘密にしてください
- 独自のURLに変更することを強く推奨（`SECURITY_ADMIN.md` 参照）
- メイン画面からはリンクがありません

### Q: データベースにデータがない

**A:** 

**Docker の場合:**
```powershell
docker-compose exec backend python -m utils.db_init
```

**手動の場合:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m utils.db_init
```

---

## 🆘 困ったら

1. **TROUBLESHOOTING_ADMIN.md** を見る
2. Docker Desktop が起動しているか確認
3. エラーメッセージをコピーして検索

---

**まずは Docker で試してみてください！🐳**

