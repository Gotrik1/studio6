FROM node:20-alpine

# Установка системных зависимостей, включая OpenSSL для Prisma
RUN apk add --no-cache libc6-compat openssl

# Установка pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma/

# Используем pnpm для установки зависимостей
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm build

EXPOSE 3001

CMD ["pnpm", "start:prod"]
