# ベースイメージとして、Node.jsを使用
FROM node:lts-alpine

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# ポートを公開
EXPOSE 8080

# 開発サーバーを起動
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]