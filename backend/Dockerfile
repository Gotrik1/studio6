
# --- Base Stage ---
# Устанавливаем базовый образ с нужной версией Node.js
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# --- Builder Stage ---
# Здесь мы устанавливаем ВСЕ зависимости (включая dev) и собираем проект
FROM base AS builder
WORKDIR /usr/src/app

# Копируем корневые файлы для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости для всех воркспейсов
# --no-frozen-lockfile нужен для CI, если lock-файл мог устареть
RUN pnpm install --no-frozen-lockfile

# Копируем весь исходный код backend
COPY backend ./backend

# Генерируем Prisma Client (необходимо ПЕРЕД сборкой)
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем только backend
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
# Здесь мы создаем чистый образ только с production-зависимостями и собранным кодом
FROM base AS runner
WORKDIR /usr/src/app

# Копируем корневые файлы и package.json воркспейсов
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем только production зависимости
RUN pnpm install --prod --no-frozen-lockfile

# Копируем собранный код и Prisma schema из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Открываем порт и запускаем приложение
EXPOSE 3001
CMD ["pnpm", "start:backend"]
