# バックエンドとフロントエンドの関係

## 概要

このプロジェクトは、**React + TypeScript** のフロントエンドと **FastAPI (Python)** のバックエンドで構成されています。

## アーキテクチャ図

```
┌─────────────────────────────────────────────────────────┐
│                    フロントエンド                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React + TypeScript + Vite                        │  │
│  │  Port: 8080                                       │  │
│  │  Location: client/                                │  │
│  └──────────────────────────────────────────────────┘  │
│                        │                                │
│                        │ HTTP/HTTPS                     │
│                        │ (CORS設定済み)                 │
│                        ▼                                │
└─────────────────────────────────────────────────────────┘
                        │
                        │
┌─────────────────────────────────────────────────────────┐
│                    バックエンド                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  FastAPI (Python)                                 │  │
│  │  Port: 8000                                       │  │
│  │  Location: backend/                                │  │
│  │                                                    │  │
│  │  API Endpoints:                                   │  │
│  │  - /api/v1/classrooms                             │  │
│  │  - /api/v1/occupancy                              │  │
│  │  - /api/v1/schedules                              │  │
│  │  - /health                                         │  │
│  └──────────────────────────────────────────────────┘  │
│                        │                                │
│                        │                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  SQLite Database                                  │  │
│  │  Location: backend/ynu_classrooms.db              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## フロントエンド（React + TypeScript）

### 技術スタック
- **React 18** + **TypeScript**
- **Vite** (ビルドツール・開発サーバー)
- **React Router 6** (SPAルーティング)
- **TailwindCSS 3** (スタイリング)
- **TanStack Query** (データフェッチング)

### ディレクトリ構造
```
client/
├── pages/              # ページコンポーネント
│   ├── Index.tsx       # ホームページ（教室一覧）
│   ├── Admin.tsx       # 管理画面
│   └── NotFound.tsx    # 404ページ
├── components/         # 再利用可能なコンポーネント
│   ├── ClassroomCard.tsx
│   ├── Header.tsx
│   └── SearchFilters.tsx
├── lib/
│   └── api.ts          # APIクライアント（重要！）
└── App.tsx             # アプリケーションエントリーポイント
```

### 開発サーバー
- **ポート**: `8080`
- **起動コマンド**: `pnpm dev`
- **URL**: `http://localhost:8080`

### API接続設定

フロントエンドは環境変数 `VITE_API_URL` を使用してバックエンドのURLを設定します。

```typescript
// client/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

**デフォルト値**: `http://localhost:8000` (FastAPIバックエンド)

## バックエンド（FastAPI - Python）

### 技術スタック
- **FastAPI** (Python Webフレームワーク)
- **SQLAlchemy** (ORM)
- **SQLite** (データベース)
- **Pydantic** (データバリデーション)

### ディレクトリ構造
```
backend/
├── api/
│   ├── main.py         # FastAPIアプリケーション
│   ├── models/         # Pydanticモデル
│   └── routes/         # APIルートハンドラー
│       ├── classrooms.py
│       ├── occupancy.py
│       └── schedules.py
├── database/
│   ├── models/         # SQLAlchemyモデル
│   └── session.py      # データベースセッション
├── camera/             # カメラ処理（オプション）
├── config.py           # 設定ファイル
└── ynu_classrooms.db   # SQLiteデータベース
```

### サーバー設定
- **ポート**: `8000`
- **起動コマンド**: `python backend/run.py` または `uvicorn backend.api.main:app --reload`
- **URL**: `http://localhost:8000`
- **APIドキュメント**: `http://localhost:8000/docs` (Swagger UI)

### CORS設定

バックエンドは以下のオリジンからのアクセスを許可しています：

```python
# backend/config.py
allowed_origins: List[str] = [
    "http://localhost:8080",    # Vite開発サーバー
    "http://localhost:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
    "http://localhost:5173",    # Viteデフォルトポート
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
```

## APIエンドポイント

### 教室関連
- `GET /api/v1/classrooms` - 教室一覧取得
- `GET /api/v1/classrooms/{id}` - 特定の教室情報取得

### 占有状況関連
- `GET /api/v1/occupancy` - 全教室の占有状況取得
- `GET /api/v1/occupancy/classrooms-with-status` - 教室と占有状況を結合して取得

### スケジュール関連
- `GET /api/v1/schedules/` - スケジュール一覧取得
- `GET /api/v1/schedules/active` - アクティブなスケジュール取得
- `GET /api/v1/schedules/{id}` - 特定のスケジュール取得
- `POST /api/v1/schedules/` - スケジュール作成
- `PUT /api/v1/schedules/{id}` - スケジュール更新
- `DELETE /api/v1/schedules/{id}` - スケジュール削除

### ヘルスチェック
- `GET /health` - サーバーの状態確認

## データフロー

### 1. 教室一覧の取得例

```
ユーザー操作
    │
    ▼
React Component (Index.tsx)
    │
    ▼
getClassroomsWithStatus() (client/lib/api.ts)
    │
    ▼
HTTP GET Request → http://localhost:8000/api/v1/occupancy/classrooms-with-status
    │
    ▼
FastAPI Route Handler (backend/api/routes/occupancy.py)
    │
    ▼
SQLAlchemy Query → SQLite Database
    │
    ▼
JSON Response ← FastAPI
    │
    ▼
React Component でデータ表示
```

### 2. APIクライアントの実装

```typescript
// client/lib/api.ts
export async function getClassroomsWithStatus(params?: {
  faculty?: string;
  building_id?: string;
  available_only?: boolean;
  target_date?: string;
  target_period?: number;
}): Promise<ClassroomWithStatus[]> {
  const queryParams = new URLSearchParams();
  // パラメータをクエリ文字列に変換
  if (params?.faculty) queryParams.append('faculty', params.faculty);
  // ...
  
  const endpoint = `/api/v1/occupancy/classrooms-with-status${query ? `?${query}` : ''}`;
  return fetchAPI<ClassroomWithStatus[]>(endpoint);
}
```

### 3. フロントエンドでの使用例

```typescript
// client/pages/Index.tsx
import { getClassroomsWithStatus } from '@/lib/api';

useEffect(() => {
  const fetchClassrooms = async () => {
    const data = await getClassroomsWithStatus({
      faculty: currentFilters.faculty,
      building_id: currentFilters.building,
    });
    setClassrooms(convertedClassrooms);
  };
  fetchClassrooms();
}, [currentFilters]);
```

## データ型の共有

### バックエンド（Pydanticモデル）
```python
# backend/api/models/classroom.py
class Classroom(BaseModel):
    id: str
    room_number: str
    building_id: str
    faculty: str
    floor: int
    capacity: int
    # ...
```

### フロントエンド（TypeScriptインターフェース）
```typescript
// client/lib/api.ts
export interface Classroom {
  id: string;
  room_number: string;
  building_id: string;
  faculty: string;
  floor: number;
  capacity: number;
  // ...
}
```

**注意**: 現在、型定義は手動で同期されています。バックエンドのモデルを変更した場合は、フロントエンドの型定義も更新する必要があります。

## Expressサーバーについて

`server/` ディレクトリには Express (Node.js) サーバーが含まれていますが、**現在は使用されていません**。

- Fusion Starterテンプレートの一部として残っています
- `vite.config.ts` で統合が無効化されています
- デモエンドポイント (`/api/ping`, `/api/demo`) のみが実装されています

実際のAPIロジックはすべて **FastAPIバックエンド** で実装されています。

## 環境変数

### フロントエンド
- `VITE_API_URL`: バックエンドAPIのURL（デフォルト: `http://localhost:8000`）

### バックエンド
- `DATABASE_URL`: データベース接続URL（デフォルト: `sqlite:///./ynu_classrooms.db`）
- `CAMERA_ENABLED`: カメラ機能の有効/無効（デフォルト: `True`）
- `DEBUG`: デバッグモード（デフォルト: `True`）

## 開発時の起動方法

### 1. バックエンドを起動
```bash
cd backend
python run.py
# または
uvicorn api.main:app --reload --port 8000
```

### 2. フロントエンドを起動（別ターミナル）
```bash
pnpm dev
```

### 3. ブラウザでアクセス
- フロントエンド: `http://localhost:8080`
- バックエンドAPI: `http://localhost:8000`
- APIドキュメント: `http://localhost:8000/docs`

## 本番環境での設定

本番環境では、環境変数 `VITE_API_URL` を本番バックエンドのURLに設定します：

```bash
VITE_API_URL=https://api.yourdomain.com
```

または、`.env` ファイルに設定：

```
VITE_API_URL=https://api.yourdomain.com
```

## まとめ

- **フロントエンド**: React + TypeScript (ポート8080)
- **バックエンド**: FastAPI + Python (ポート8000)
- **通信**: HTTP/HTTPS (CORS設定済み)
- **データベース**: SQLite (バックエンド内)
- **APIクライアント**: `client/lib/api.ts` で一元管理
- **型定義**: 手動同期（バックエンドとフロントエンドで別々に定義）

