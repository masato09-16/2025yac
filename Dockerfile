# ベースイメージとして、Node.jsを使用
FROM node:lts-alpine

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# node-gyp のビルドに必要なツール（alpine）
RUN apk add --no-cache python3 make g++ linux-headers

# npm に Python の場所を伝える（isolated-vm 等のビルド用）
ENV npm_config_python=/usr/bin/python3

# pnpm を有効化してロックファイルでインストール
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# ソースコードをコピー
COPY . .

# ポートを公開
EXPOSE 8080

# 開発サーバーを起動
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]