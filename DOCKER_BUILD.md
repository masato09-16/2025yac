# Docker ビルドと起動ガイド

## 問題の解決

Dockerのビルドエラーが出た場合、以下の手順で解決できます。

## 1. キャッシュをクリアして再ビルド

```bash
# Dockerイメージとキャッシュをクリア
docker system prune -a

# または、特定のイメージを削除
docker rmi yac2025-antiaging-frontend
docker rmi yac2025-antiaging-backend

# 再ビルド（キャッシュなし）
docker compose build --no-cache
```

## 2. 個別にビルドする

```bash
# フロントエンドのみ
docker compose build frontend --no-cache

# バックエンドのみ
docker compose build backend --no-cache
```

## 3. 起動コマンド

```bash
# バックグラウンドで起動
docker compose up -d

# ログを確認
docker compose logs -f

# 停止
docker compose down
```

## トラブルシューティング

### ポートが使用中

```bash
# ポートを確認
netstat -ano | findstr :8080
netstat -ano | findstr :8000

# 別のポートに変更
# docker-compose.ymlを編集
ports:
  - "8081:8080"  # フロントエンド
  - "8001:8000"  # バックエンド
```

### ボリュームマウントの問題

```bash
# ボリュームを削除
docker volume ls
docker volume rm yac2025-antiaging_node_modules

# 再作成
docker compose up -d
```

