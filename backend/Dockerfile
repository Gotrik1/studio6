# 1. Builder stage: Устанавливаем зависимости, компилируем код
FROM node:20 AS builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Устанавливаем pnpm глобально, чтобы команда была доступна
RUN npm install -g pnpm@9.15.9

# Копируем файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

# Устанавливаем все зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код проекта
# Это делается после установки зависимостей для лучшего кэширования
COPY . .

# Устанавливаем openssl, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем backend приложение
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Create a slim image for production
FROM node:20-slim AS runner

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем production-зависимости и package.json для установки
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

# Устанавливаем openssl
RUN apt-get update && apt-get install -y openssl

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@9.15.9

# Устанавливаем только production-зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем собранное приложение из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Указываем команду для запуска приложения в формате exec array
# Это более надежный способ, который избегает проблем с `sh -c`
CMD ["pnpm", "start:backend"]
