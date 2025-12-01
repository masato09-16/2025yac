# カメラ機能セットアップガイド

YOLOv8を使用したカメラ人数検出機能のセットアップ手順です。

## 📋 目次

1. [概要](#概要)
2. [アーキテクチャ](#アーキテクチャ)
3. [ローカル開発（PCカメラ）](#ローカル開発pcカメラ)
4. [本番環境（ラズベリーパイ）](#本番環境ラズベリーパイ)
5. [トラブルシューティング](#トラブルシューティング)

---

## 概要

このシステムは、カメラから画像をキャプチャし、YOLOv8で人数を検出してデータベースに保存します。

**重要:** Vercelのサーバーレス環境ではカメラは使用できません。カメラ検出はローカル（PC/ラズパイ）で実行し、結果をVercelのAPIに送信します。

### システム構成

```
[PC/ラズパイ]                    [Vercel (クラウド)]
    ↓                                  ↓
  カメラ                            FastAPI + DB
    ↓                                  ↑
capture_camera.py                      |
    ↓                                  |
YOLOv8で検出 ----API経由で送信---→     |
    ↓                                  ↓
人数をカウント                    データベース更新
                                       ↓
                                [ユーザーのブラウザ]
                                       ↓
                                  UIに人数表示
```

---

## アーキテクチャ

### コンポーネント

- **capture_camera.py**: カメラから画像をキャプチャし、APIに送信
- **camera/detector.py**: YOLOv8を使用した人数検出
- **camera/source.py**: PCとラズパイのカメラソース抽象化
- **api/routes/camera.py**: 人数検出APIエンドポイント

### データフロー

1. `capture_camera.py`がカメラから画像をキャプチャ
2. YOLOv8で人物（class_id=0）を検出
3. 人数をカウント
4. `/api/v1/camera/detect`エンドポイントに送信
5. データベース（Supabase）に保存
6. UIがデータベースから人数を取得して表示

---

## ローカル開発（PCカメラ）

### 1. 依存関係のインストール

```bash
cd backend
pip install -r requirements.txt
```

### 2. YOLOv8モデルのダウンロード

初回実行時に自動的にダウンロードされますが、手動でダウンロードすることもできます:

```bash
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

### 3. 環境変数の設定

`.env`ファイルにカメラ設定を追加:

```bash
# カメラ機能を有効化
CAMERA_ENABLED=true
CAMERA_TYPE=pc
CAMERA_SOURCE=0
```

または、`.env.camera`をコピー:

```bash
cp .env.camera .env
```

### 4. FastAPIサーバーの起動

```bash
# ローカル開発環境で起動
uvicorn api.main:app --reload
```

ログに以下が表示されることを確認:
```
INFO:     Camera routes enabled
```

### 5. カメラキャプチャスクリプトの実行

別のターミナルで:

```bash
# 基本的な使用方法
python capture_camera.py --classroom-id bus1-105

# プレビューウィンドウを表示
python capture_camera.py --classroom-id bus1-105 --show-preview

# 検出間隔を変更（10秒ごと）
python capture_camera.py --classroom-id bus1-105 --interval 10

# 別のカメラデバイスを使用
python capture_camera.py --classroom-id bus1-105 --camera-id 1
```

### 6. 動作確認

1. カメラから画像がキャプチャされる
2. YOLOv8で人数が検出される
3. ログに検出結果が表示される:
   ```
   ✓ 検出成功 - 教室ID: bus1-105, 人数: 3人, 信頼度: 0.85
   ```
4. データベースに保存される
5. UIに人数が表示される

---

## 本番環境（ラズベリーパイ）

### 1. ラズベリーパイのセットアップ

```bash
# システムの更新
sudo apt-get update
sudo apt-get upgrade

# 必要なパッケージのインストール
sudo apt-get install python3-pip python3-opencv
```

### 2. プロジェクトのクローン

```bash
git clone <your-repo-url>
cd yac2025-antiaging/backend
```

### 3. 依存関係のインストール

```bash
pip3 install -r requirements.txt
```

### 4. 環境変数の設定

`.env`ファイルを作成:

```bash
# カメラ機能を有効化
CAMERA_ENABLED=true
CAMERA_TYPE=raspberry_pi
CAMERA_SOURCE=/dev/video0

# VercelのAPIエンドポイント
API_URL=https://your-app.vercel.app
```

### 5. カメラのテスト

```bash
# カメラが認識されているか確認
ls /dev/video*

# カメラのテスト
python3 -c "from camera.source import CameraSource; print(CameraSource.test_camera('raspberry_pi', '/dev/video0'))"
```

### 6. カメラキャプチャの実行

```bash
# Vercelにデプロイされたアプリに送信
python3 capture_camera.py \
  --classroom-id bus1-105 \
  --api-url https://your-app.vercel.app \
  --interval 5
```

### 7. 自動起動の設定（オプション）

systemdサービスを作成して、ラズパイ起動時に自動実行:

```bash
sudo nano /etc/systemd/system/camera-capture.service
```

以下の内容を追加:

```ini
[Unit]
Description=Camera Person Detection
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/yac2025-antiaging/backend
Environment="CAMERA_ENABLED=true"
Environment="CAMERA_TYPE=raspberry_pi"
Environment="CAMERA_SOURCE=/dev/video0"
ExecStart=/usr/bin/python3 capture_camera.py --classroom-id bus1-105 --api-url https://your-app.vercel.app --interval 5
Restart=always

[Install]
WantedBy=multi-user.target
```

サービスを有効化:

```bash
sudo systemctl enable camera-capture
sudo systemctl start camera-capture
sudo systemctl status camera-capture
```

---

## トラブルシューティング

### カメラが開けない

**症状:**
```
カメラを開けませんでした: タイプ=pc, ソース=0
```

**解決策:**

1. **カメラが接続されているか確認:**
   ```bash
   # Windows
   デバイスマネージャーでカメラを確認
   
   # Linux/Mac
   ls /dev/video*
   ```

2. **別のカメラIDを試す:**
   ```bash
   # カメラID 1を試す
   CAMERA_SOURCE=1 python capture_camera.py --classroom-id bus1-105
   ```

3. **他のアプリがカメラを使用していないか確認:**
   - Zoom、Teams、Skypeなどを終了

### YOLOv8モデルが見つからない

**症状:**
```
FileNotFoundError: yolov8n.pt not found
```

**解決策:**

```bash
# モデルを手動でダウンロード
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

### APIサーバーに接続できない

**症状:**
```
✗ APIサーバーに接続できません: http://localhost:8000
```

**解決策:**

1. **FastAPIサーバーが起動しているか確認:**
   ```bash
   uvicorn api.main:app --reload
   ```

2. **正しいURLを指定:**
   ```bash
   # ローカル
   python capture_camera.py --classroom-id bus1-105 --api-url http://localhost:8000
   
   # Vercel
   python capture_camera.py --classroom-id bus1-105 --api-url https://your-app.vercel.app
   ```

### カメラルートが無効

**症状:**
```
INFO:     Camera routes disabled (set CAMERA_ENABLED=true to enable)
```

**解決策:**

`.env`ファイルに追加:
```bash
CAMERA_ENABLED=true
```

### ラズベリーパイでカメラが動作しない

**症状:**
```
Failed to open camera: type=raspberry_pi, source=/dev/video0
```

**解決策:**

1. **カメラモジュールを有効化:**
   ```bash
   sudo raspi-config
   # Interface Options > Camera > Enable
   ```

2. **カメラデバイスを確認:**
   ```bash
   ls -l /dev/video*
   ```

3. **権限を確認:**
   ```bash
   sudo usermod -a -G video $USER
   # 再ログインが必要
   ```

---

## 参考情報

- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [OpenCV Documentation](https://docs.opencv.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
