
# --- Base Stage ---
# Устанавливаем базовый образ с нужной версией Node.js
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# --- Builder Stage ---
# Здесь мы устанавливаем ВСЕ зависимости (включая dev) и собираем проект
FROM base AS builder
WORKDIR /app

# Копируем корневые файлы для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости для всех воркспейсов
# --no-frozen-lockfile нужен для CI, если lock-файл мог устареть
RUN pnpm install --no-frozen-lockfile

# Копируем весь исходный код frontend
COPY frontend ./frontend

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
# Здесь мы создаем чистый образ только с production-зависимостями и собранным кодом
FROM base AS runner
WORKDIR /app

# Копируем корневые файлы и package.json воркспейсов
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем только production зависимости
RUN pnpm install --prod --no-frozen-lockfile

# Копируем собранный код из builder-стадии
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package.json ./frontend/

# Открываем порт и запускаем приложение
EXPOSE 9002
CMD ["pnpm", "start:frontend"]
