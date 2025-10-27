# 🚀 クイックスタートガイド

## 必要なもの

- Python 3.8+
- Node.js 18+ & pnpm
- Windows PowerShell（Windowsの場合）

---

## 起動手順（初回）

### ステップ1: バックエンドのセットアップ

```bash
# 1. バックエンドディレクトリに移動
cd backend

# 2. 仮想環境をアクティベート（既に作成済み）
.\venv\Scripts\Activate.ps1

# 3. データベースを初期化（初回のみ）
py utils/db_init.py

# 4. FastAPIサーバーを起動
py run.py
```

✅ **確認**: http://localhost:8000/docs にアクセス

---

### ステップ2: フロントエンドの起動

**別のターミナルを開いて:**

```bash
# 1. プロジェクトルートに移動
cd C:\Users\masat\yac2025-antiaging

# 2. 依存関係をインストール（初回のみ）
pnpm install

# 3. フロントエンドを起動
pnpm dev
```

✅ **確認**: http://localhost:8080 にアクセス

---

## 起動手順（2回目以降）

### ターミナル1: バックエンド

```bash
cd backend
.\venv\Scripts\Activate.ps1
py run.py
```

### ターミナル2: フロントエンド

```bash
pnpm dev
```

---

## 🎯 使ってみよう

1. **ブラウザで http://localhost:8080 を開く**

2. **検索フィルターを試す**
   - **検索モード**: 
     - 📍 現在の空き状況: リアルタイムの教室状態を表示
     - 🔮 日時を指定して検索: 将来の日時で教室の空き状況を予測
   - **状態**: すべて / 空きのみ / 使用中のみ / データなし
   - **学部**: 教育学部、理工学部など
   - **建物**: 特定の建物を選択
   - **時限と日付**: 日時指定モードでのみ表示（1限～5限、カレンダーで日付選択）
   - 「検索する」ボタンで絞り込み

3. **APIドキュメントを見る**
   - http://localhost:8000/docs
   - 「Try it out」でAPIを直接テスト可能

4. **データベースを確認**
   - `backend/ynu_classrooms.db` をSQLiteビューアーで開く

---

## 🛑 停止方法

- 各ターミナルで `Ctrl + C` を押す

---

## 📂 プロジェクト構造

```
yac2025-antiaging/
├── backend/              # FastAPI バックエンド（ポート8000）
│   ├── api/             # APIエンドポイント
│   ├── camera/          # カメラ処理
│   ├── database/        # データベース
│   └── ynu_classrooms.db # SQLiteデータベース
│
├── client/              # React フロントエンド
│   ├── pages/          # ページコンポーネント
│   ├── components/     # UIコンポーネント
│   └── lib/            # ユーティリティ（API含む）
│
├── server/              # Express（フロントエンドと統合、ポート8080）
└── shared/              # 共有型定義
```

---

## 🔥 よくある質問

### Q: ポートを変更できますか？

**FastAPI（デフォルト: 8000）**
```python
# backend/run.py
uvicorn.run(..., port=9000)  # 好きなポートに変更
```

**Express（デフォルト: 8080）**
```typescript
// server/index.ts
const PORT = 3000;  // 好きなポートに変更
```

その場合、`backend/config.py`のCORS設定も更新してください。

---

### Q: データベースをリセットしたい

```bash
cd backend
del ynu_classrooms.db  # データベースを削除
py utils/db_init.py    # 再初期化
```

---

### Q: 教室データを追加/変更したい

1. **バックエンドのデータを編集**
   - `backend/data/classrooms.py` を編集

2. **データベースを再初期化**
   ```bash
   cd backend
   py utils/db_init.py
   ```

---

### Q: 占有状況を更新したい

**方法1: Swagger UIを使う**
1. http://localhost:8000/docs を開く
2. `POST /api/v1/occupancy/update` を選択
3. 「Try it out」をクリック
4. JSONを入力:
   ```json
   {
     "classroom_id": "edu6-101",
     "current_count": 15,
     "detection_confidence": 0.95,
     "camera_id": "cam-001"
   }
   ```
5. 「Execute」をクリック

**方法2: curlを使う**
```bash
curl -X POST http://localhost:8000/api/v1/occupancy/update \
  -H "Content-Type: application/json" \
  -d '{
    "classroom_id": "edu6-101",
    "current_count": 15,
    "detection_confidence": 0.95
  }'
```

---

## 📖 詳細ドキュメント

- **統合ガイド**: `INTEGRATION_GUIDE.md`
- **バックエンド詳細**: `BACKEND_SETUP.md`
- **プロジェクト概要**: `README.md`

---

## 💬 サポート

問題が発生した場合は、`INTEGRATION_GUIDE.md`の「トラブルシューティング」セクションを確認してください。

---

**Let's Go! 🚀**

