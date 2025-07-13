# 1. Builder stage: Установка зависимостей и сборка приложения
FROM node:20 AS builder

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Копируем файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код проекта
COPY . .

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд приложение
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Создание легковесного образа для production
FROM node:20-slim

WORKDIR /usr/src/app

# Копируем файлы манифеста и package.json бэкенда
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Устанавливаем только production-зависимости
RUN corepack enable && pnpm install --prod --frozen-lockfile

# Копируем собранный код бэкенда из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем сгенерированный Prisma Client и его движки из builder-стадии
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Указываем команду для запуска приложения
CMD ["node", "backend/dist/main"]
