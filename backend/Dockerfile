# 1. Builder stage: Устанавливаем зависимости и собираем приложение
FROM node:20 AS builder
WORKDIR /usr/src/app

# Устанавливаем pnpm, используя встроенный corepack
RUN corepack enable
RUN corepack prepare pnpm@9.15.9 --activate

# Устанавливаем системные зависимости, необходимые для Prisma
RUN apt-get update && apt-get install -y openssl

# Копируем файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies для сборки
RUN pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд-приложение
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Создаем легковесный образ для production
FROM node:20-slim AS runner
WORKDIR /usr/src/app

# Устанавливаем системные зависимости, необходимые для Prisma, в production-образе
RUN apt-get update && apt-get install -y openssl

# Устанавливаем pnpm, используя встроенный corepack
RUN corepack enable
RUN corepack prepare pnpm@9.15.9 --activate

# Копируем только необходимые для production файлы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем только production-зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем собранное приложение из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Копируем Prisma schema для генерации клиента в production
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Генерируем Prisma Client уже в production-окружении
# Это гарантирует, что будут использованы правильные бинарные файлы движков
RUN pnpm --filter prodvor-backend prisma:generate

# Указываем команду для запуска приложения
CMD ["node", "backend/dist/main"]
