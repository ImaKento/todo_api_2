# Node.js + TypeScript 環境
FROM node:18

# 作業ディレクトリ作成
WORKDIR /app

# パッケージインストール
COPY package*.json ./
RUN npm install

# アプリコードをコピー
COPY . .

# Prismaクライアント生成（開発用）
RUN npx prisma generate

# アプリ起動コマンド
CMD ["npm", "run", "start"]