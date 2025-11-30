# リアルタイム人数表示機能

経営105教室のリアルタイム人数表示機能の実装ガイドです。

## 📋 概要

この機能では、PCカメラ（または将来的にラズベリーパイ）から取得した画像を分析して、教室の人数をリアルタイムで検出・表示します。

## 🏗️ アーキテクチャ

```
PCカメラ / ラズベリーパイ
    ↓
capture_camera.py (人数検出スクリプト)
    ↓ (HTTP POST)
FastAPI (/api/v1/camera/detect)
    ↓
YOLO検出器 (人物検出)
    ↓
データベース (Occupancyテーブル更新)
    ↓ (HTTP GET, 5秒ごとにポーリング)
フロントエンド (リアルタイム表示)
```

## 🚀 使い方

### 1. バックエンドサーバーの起動

まず、FastAPIサーバーを起動してください：

```bash
cd backend
# 仮想環境をアクティベート
. venv/bin/activate  # Linux/Mac
# または
.\venv\Scripts\Activate.ps1  # Windows

# サーバーを起動
python run.py
```

サーバーが起動したら、以下で確認できます：
- API ドキュメント: http://localhost:8000/docs
- ヘルスチェック: http://localhost:8000/health

### 2. フロントエンドの起動

別のターミナルで：

```bash
# プロジェクトルートで
pnpm dev
```

フロントエンドが起動したら：
- フロントエンド: http://localhost:8080

### 3. 人数検出スクリプトの実行

経営105教室専用のスクリプトを使用：

**Windowsの場合：**

```powershell
cd backend

# 仮想環境をアクティベート
.\venv\Scripts\Activate.ps1

# 経営105教室専用スクリプトを実行（プレビューなし）
python capture_keiei105.py

# カメラの映像をローカルで確認したい場合（プレビューウィンドウを表示）
python capture_keiei105.py --preview
```

**または、仮想環境をアクティベートせずに実行：**

```powershell
cd backend

# 仮想環境のPythonを直接使用
.\venv\Scripts\python.exe capture_keiei105.py

# プレビューウィンドウを表示
.\venv\Scripts\python.exe capture_keiei105.py --preview
```

**Linux/Macの場合：**

```bash
cd backend
source venv/bin/activate

python capture_keiei105.py
python capture_keiei105.py --preview
```

**重要**: プレビューウィンドウは**ローカルのみ**表示されます。フロントエンド（Webアプリ）には表示されません。

または、一般的なスクリプトを使用して任意の教室を指定：

```powershell
# 仮想環境をアクティベート後
python capture_camera.py --classroom-id bus1-105

# プレビューウィンドウを表示
python capture_camera.py --classroom-id bus1-105 --show-preview
```

## 📝 スクリプトのオプション

### `capture_camera.py` のオプション

```bash
python capture_camera.py --help
```

主要なオプション：
- `--classroom-id`: 教室ID（必須）
- `--camera-id`: カメラデバイスID（デフォルト: 0）
- `--interval`: 検出間隔（秒）（デフォルト: 5）
- `--api-url`: APIのベースURL（デフォルト: http://localhost:8000）
- `--show-preview`: プレビューウィンドウを表示

例：

```bash
# 10秒間隔で検出
python capture_camera.py --classroom-id bus1-105 --interval 10

# プレビューウィンドウを表示
python capture_camera.py --classroom-id bus1-105 --show-preview

# 別のカメラデバイスを使用
python capture_camera.py --classroom-id bus1-105 --camera-id 1
```

### `capture_keiei105.py`

経営105教室専用のスクリプトです。設定を変更したい場合は、スクリプト内の定数を編集してください：

```python
CLASSROOM_ID = "bus1-105"
CAMERA_ID = 0  # デフォルトカメラ
INTERVAL = 5   # 5秒間隔
API_URL = "http://localhost:8000"
SHOW_PREVIEW = False  # プレビューを表示する場合は True
```

## 📊 フロントエンドでの表示

1. ブラウザで http://localhost:8080 を開く
2. 検索モードを「現在の教室一覧」に設定
3. 経営学部を選択してフィルター
4. 経営105教室のカードで人数がリアルタイムで更新される

人数は5秒ごとに自動更新されます（ポーリング）。

## 🔧 ラズベリーパイでの使用

将来、ラズベリーパイで使用する場合は、同じAPIを使用できます：

1. ラズベリーパイでカメラから画像を取得
2. `capture_camera.py`と同じように、`/api/v1/camera/detect`エンドポイントにPOST送信

または、`simulate_camera.py`を参考にして、ラズパイ専用のスクリプトを作成することもできます。

## 📁 ファイル構成

```
backend/
├── capture_camera.py          # 汎用的なカメラキャプチャスクリプト
├── capture_keiei105.py        # 経営105教室専用スクリプト
├── camera/
│   ├── detector.py            # YOLO検出器
│   └── processor.py           # カメラ処理
├── api/
│   └── routes/
│       └── camera.py          # カメラAPIエンドポイント
└── static/
    └── processed/             # 解析結果画像の保存先

client/
└── pages/
    └── Index.tsx              # リアルタイム更新（ポーリング）実装
```

## 🐛 トラブルシューティング

### カメラが開けない

```
エラー: カメラを開けませんでした: デバイスID 0
```

**解決策:**
- カメラが接続されているか確認
- 別のカメラIDを試す：`--camera-id 1`
- 他のアプリケーションがカメラを使用していないか確認

### APIサーバーに接続できない

```
エラー: APIサーバーに接続できません
```

**解決策:**
- FastAPIサーバーが起動しているか確認
- `http://localhost:8000/health` にアクセスして確認
- API URLを確認：`--api-url http://localhost:8000`

### 人数が表示されない

**解決策:**
1. 人数検出スクリプトが正常に動作しているか確認
2. ブラウザの開発者ツール（F12）でネットワークタブを確認
3. APIレスポンスを確認：`http://localhost:8000/api/v1/occupancy/classroom/bus1-105`
4. データベースを確認

### 検出精度が低い

**解決策:**
- カメラの位置や角度を調整
- 照明条件を改善
- 検出間隔を短くする（`--interval 3`など）

## 📚 関連ドキュメント

- [バックエンドセットアップガイド](BACKEND_SETUP.md)
- [統合ガイド](INTEGRATION_GUIDE.md)
- [カメラ検出API仕様](backend/api/routes/camera.py)

## 🎯 次のステップ

- [ ] 複数教室に対応
- [ ] WebSocketによるリアルタイム更新（ポーリングから移行）
- [ ] 検出精度の向上
- [ ] ラズベリーパイでの実装
- [ ] 検出履歴の可視化

## 🚀 本番環境での注意点

### ポーリング間隔の調整

**開発環境**: 5秒ごとに更新（デフォルト）  
**本番環境**: 30秒以上を推奨（環境変数で設定）

本番環境では、多数のユーザーが同時にアクセスするため、ポーリング間隔を長くすることでサーバー負荷を軽減します。

環境変数で設定：
```env
# フロントエンド（Netlify/Vercel）
VITE_POLLING_INTERVAL=30000  # 30秒（ミリ秒単位）
```

### データベース

本番環境では、**Supabase（PostgreSQL）**などの外部データベースが必要です。

- SQLiteはサーバーレス環境（Netlify Functions/Vercel Functions）では使用できません
- 詳細は [Supabaseデプロイガイド](SUPABASE_DEPLOYMENT.md) を参照

### スケーラビリティ

現在の実装（5秒ポーリング）では：
- **100人のユーザー** → 1秒あたり20リクエスト
- **1000人のユーザー** → 1秒あたり200リクエスト

本番環境では以下を推奨：
1. **ポーリング間隔を30秒以上に設定**（上記参照）
2. **WebSocket/SSEによるリアルタイム更新**（将来の改善）
3. **Redisキャッシング**（オプション）

## 💡 ヒント

- **プレビューウィンドウ**: ローカルでのみ表示されます。フロントエンドには一切表示されません
  - プレビューを表示するには: `python capture_keiei105.py --preview`
  - プレビューウィンドウで 'q'キーを押すと終了します
- 検出間隔は5秒が推奨ですが、必要に応じて調整できます
- 解析結果画像は `backend/static/processed/{教室ID}.jpg` に保存されます

## 🔒 セキュリティ

- **カメラ映像はフロントエンドに送信されません**
- プレビューウィンドウはローカルでのみ表示されます
- カメラ映像はバックエンドで処理され、人数のみがデータベースに保存されます
- 解析結果画像（バウンディングボックス付き）のみがAPI経由でアクセス可能です


