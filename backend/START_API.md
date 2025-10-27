# FastAPI サーバーの起動方法

## 起動コマンド

```bash
# 仮想環境をアクティベート
.\venv\Scripts\Activate.ps1

# FastAPIサーバーを起動
py run.py
```

または

```bash
py -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

## アクセス

- APIドキュメント: http://localhost:8000/docs
- ヘルスチェック: http://localhost:8000/health
- 教室一覧: http://localhost:8000/api/v1/classrooms

## テスト

ブラウザまたはcurlで以下にアクセス：

```bash
# ヘルスチェック
curl http://localhost:8000/health

# 教室一覧
curl http://localhost:8000/api/v1/classrooms
```

