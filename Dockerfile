# ベースイメージとして、Node.jsを使用
FROM node:lts-alpine3.22

# 作業ディレクトリを設定
WORKDIR /frontend

# パッケージファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

CMD ["npm", "run", "dev"]