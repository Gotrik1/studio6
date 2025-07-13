# 1. Builder stage: Install dependencies, build the app
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Включаем corepack для управления pnpm
RUN corepack enable

# Копируем package.json и pnpm-lock.yaml из корня монорепозитория
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Копируем package.json из каждого воркспейса
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json

# Устанавливаем OpenSSL, который необходим для Prisma Engine
RUN apt-get update && apt-get install -y openssl

# Устанавливаем все зависимости для всего монорепозитория
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код
COPY . .

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд приложение
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Create a slim image for production
FROM node:20-slim AS runner

WORKDIR /usr/src/app

# Включаем corepack для управления pnpm
RUN corepack enable

# Копируем только необходимые для production-установки файлы
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json

# Устанавливаем ТОЛЬКО production зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем скомпилированный код бэкенда
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем Prisma schema для миграций в production
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Копируем сгенерированный Prisma client
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Копируем корневой package.json для запуска скриптов
COPY --from=builder /usr/src/app/package.json ./package.json

# Команда для запуска приложения
CMD ["pnpm", "start:backend"]
