# --- Base Stage ---
FROM node:20-alpine AS base

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base AS builder

# Устанавливаем рабочую директорию в корень проекта
WORKDIR /usr/src/app

# Копируем корневые файлы-манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Копируем .npmrc если он есть, не вызывая ошибку, если его нет
COPY .npmrc* ./

# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma для бэкенда
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies для всех воркспейсов
# --frozen-lockfile используется для CI для строгой установки по lock-файлу
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код (после установки зависимостей для лучшего кэширования)
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
# Prisma generate вызывается автоматически через postinstall скрипт в package.json
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
FROM base AS runner

WORKDIR /usr/src/app

# Копируем только production-зависимости из builder-стадии
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# Копируем скомпилированный код
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Команда для запуска production-сервера
CMD ["pnpm", "start:backend"]
