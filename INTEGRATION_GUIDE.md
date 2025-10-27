# フロントエンドとFastAPIバックエンドの統合ガイド

## 🎉 統合完了！

フロントエンド（React + Express）とバックエンド（FastAPI）の統合が完了しました。

---

## 🚀 起動方法

### 1. FastAPI バックエンドの起動

```bash
# バックエンドディレクトリに移動
cd backend

# 仮想環境をアクティベート（Windowsの場合）
.\venv\Scripts\Activate.ps1

# FastAPIサーバーを起動（ポート8000）
py run.py
```

**確認:**
- APIドキュメント: http://localhost:8000/docs
- ヘルスチェック: http://localhost:8000/health
- 教室一覧API: http://localhost:8000/api/v1/classrooms

---

### 2. フロントエンドの起動

別のターミナルで：

```bash
# プロジェクトルートディレクトリで
pnpm dev
```

**確認:**
- フロントエンド: http://localhost:8080

---

## 📡 仕組み

### アーキテクチャ

```
┌─────────────────┐
│   React App     │  ← ユーザーが見る画面
│  (Port 8080)    │
└────────┬────────┘
         │
         │ HTTP Request
         │
┌────────▼────────┐
│  FastAPI Server │  ← 教室データ・占有状況管理
│  (Port 8000)    │
└────────┬────────┘
         │
         ▼
    SQLite DB
```

### データフロー

1. **ユーザーがページを開く**
   - `Index.tsx`が`useEffect`でAPIを呼び出し

2. **フロントエンド → FastAPI**
   - `client/lib/api.ts`の`getClassroomsWithStatus()`を使用
   - `GET http://localhost:8000/api/v1/occupancy/classrooms-with-status`

3. **FastAPI → データベース**
   - 教室情報と占有状況を取得
   - データを結合してレスポンス

4. **FastAPI → フロントエンド**
   - JSONでデータを返却
   - CORSが設定済みなので問題なし

5. **フロントエンド表示**
   - データを変換して表示
   - 占有率に応じて状態を分類
     - `available`: 占有率 < 10%
     - `occupied`: 10% ≤ 占有率 < 90%
     - `full`: 占有率 ≥ 90%

---

## 🔧 実装詳細

### 1. CORS設定（既に完了）

**backend/config.py:**
```python
allowed_origins: List[str] = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
]
```

**backend/api/main.py:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. API クライアント（新規作成）

**client/lib/api.ts:**
- `getClassrooms()` - 教室一覧を取得
- `getClassroomsWithStatus()` - 教室と占有状況を取得
- `getAllOccupancy()` - 占有状況のみを取得
- `healthCheck()` - ヘルスチェック

### 3. フロントエンド統合（Index.tsx更新）

**主な変更点:**
- `useEffect`でAPIからデータ取得
- ローディング状態の管理
- エラーハンドリング
- FastAPIのスネークケース → フロントエンドのキャメルケース変換

---

## 📋 利用可能なAPIエンドポイント

### 教室管理

| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| GET | `/api/v1/classrooms` | 全教室を取得 |
| GET | `/api/v1/classrooms/{id}` | 特定の教室を取得 |
| POST | `/api/v1/classrooms` | 新規教室を作成 |
| PUT | `/api/v1/classrooms/{id}` | 教室を更新 |
| DELETE | `/api/v1/classrooms/{id}` | 教室を削除 |

### 占有状況

| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| GET | `/api/v1/occupancy` | 全占有状況を取得 |
| GET | `/api/v1/occupancy/classroom/{id}` | 特定教室の占有状況 |
| GET | `/api/v1/occupancy/classrooms-with-status` | **教室+占有状況を一緒に取得** ⭐ |
| POST | `/api/v1/occupancy/update` | 占有状況を更新 |

### クエリパラメータ例

```typescript
// 学部でフィルター
await getClassroomsWithStatus({ faculty: 'engineering' });

// 建物でフィルター
await getClassroomsWithStatus({ building_id: 'eng-a' });

// 空き教室のみ
await getClassroomsWithStatus({ available_only: true });

// 組み合わせ
await getClassroomsWithStatus({ 
  faculty: 'education', 
  building_id: 'edu-7',
  available_only: true 
});
```

---

## 🎨 カスタマイズ

### API URLの変更

デフォルトでは`http://localhost:8000`を使用しています。

変更したい場合は、プロジェクトルートに`.env`ファイルを作成：

```env
VITE_API_URL=http://your-api-server:8000
```

### リアルタイム更新の実装

現在は初回ロード時のみデータを取得しています。

定期的に更新したい場合：

```typescript
useEffect(() => {
  const fetchData = async () => {
    // ... データ取得
  };
  
  fetchData(); // 初回
  
  const interval = setInterval(fetchData, 30000); // 30秒ごと
  
  return () => clearInterval(interval); // クリーンアップ
}, [currentFilters]);
```

---

## 🐛 トラブルシューティング

### エラー: "教室データの取得に失敗しました"

**原因:**
- FastAPIサーバーが起動していない
- ポート8000が別のプロセスで使用されている

**解決策:**
1. FastAPIサーバーを起動する
2. http://localhost:8000/health にアクセスして確認

### CORS エラー

**症状:**
```
Access to fetch at 'http://localhost:8000/api/v1/classrooms' 
from origin 'http://localhost:8080' has been blocked by CORS policy
```

**解決策:**
- FastAPIサーバーを再起動
- `backend/config.py`の`allowed_origins`を確認

### データが空で表示される

**原因:**
- データベースが初期化されていない

**解決策:**
```bash
cd backend
py utils/db_init.py
```

---

## 📝 次のステップ

1. **カメラ統合** - 実際のカメラから人数をカウント
2. **リアルタイム更新** - WebSocketまたはSSEで自動更新
3. **認証** - ユーザーログイン機能
4. **履歴データ** - 過去の占有状況をグラフ表示
5. **通知機能** - お気に入りの教室が空いたら通知

---

## 📚 参考資料

- **FastAPI公式ドキュメント**: https://fastapi.tiangolo.com/
- **React公式ドキュメント**: https://react.dev/
- **プロジェクト構造**: `README.md`を参照
- **バックエンド詳細**: `BACKEND_SETUP.md`を参照

---

## 💡 ヒント

- **Swagger UI**（http://localhost:8000/docs）でAPIを直接テストできます
- **ブラウザの開発者ツール**でネットワークリクエストを確認できます
- **React Developer Tools**でコンポーネントの状態を確認できます

---

**統合成功！楽しい開発を！** 🎉

