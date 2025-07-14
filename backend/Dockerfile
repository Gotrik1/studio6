# --- Base Stage (для установки системных зависимостей) ---
FROM node:20-alpine as base
RUN apk add --no-cache openssl

# --- Builder Stage (для сборки TypeScript и генерации Prisma) ---
FROM base as builder
WORKDIR /usr/src/app

# Копируем только файлы-манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса для корректной установки
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем Prisma-схему ДО установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies, и генерируем Prisma Client
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем только backend
RUN pnpm --filter prodvor-backend build

# --- Pruner Stage (для production-зависимостей) ---
FROM base as pruner
WORKDIR /app

# Копируем собранный проект и необходимые манифесты из builder
COPY --from=builder /usr/src/app/backend ./backend
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/node_modules/.pnpm ./node_modules/.pnpm

# Устанавливаем ТОЛЬКО production-зависимости для бэкенда
RUN pnpm install --prod --filter prodvor-backend

# --- Runner Stage (финальный образ для production) ---
FROM base as runner
WORKDIR /app

# Копируем собранные артефакты и production-версию node_modules из pruner
COPY --from=pruner /app/backend/dist ./dist
COPY --from=pruner /app/backend/package.json ./package.json
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=pruner /app/backend/prisma ./prisma

# Команда для запуска приложения
CMD ["node", "dist/main.js"]

# --- Migrations Stage (для запуска миграций в CI) ---
FROM builder as migrations
WORKDIR /app

# Копируем все из builder-стадии, где есть все зависимости (включая dev)
COPY --from=builder /usr/src/app .

# Команда для запуска миграций
CMD ["pnpm", "--filter", "prodvor-backend", "prisma:migrate:deploy"]
