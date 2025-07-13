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

# Устанавливаем все зависимости, включая devDependencies для всех воркспейсов
# --frozen-lockfile используется для CI для строгой установки по lock-файлу
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только frontend, так как это Dockerfile для фронтенда
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
FROM base AS runner

WORKDIR /usr/src/app

# Копируем только production-зависимости из builder-стадии
COPY --from=builder /usr/src/app/frontend/node_modules ./frontend/node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json

# Копируем скомпилированный код (.next) и публичные файлы
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Команда для запуска production-сервера
CMD ["pnpm", "start:frontend"]
