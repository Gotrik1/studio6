# --- Base Stage ---
# Используем базовый образ Node.js
FROM node:20-alpine as base

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
# На этой стадии мы устанавливаем все зависимости (включая dev) и собираем проект.
FROM base AS builder

# Устанавливаем рабочую директорию в корень проекта
WORKDIR /usr/src/app

# Копируем файлы манифеста, чтобы кэшировать слой с зависимостями
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json .npmrc* ./

# Копируем package.json каждого воркспейса, чтобы pnpm понял, что их нужно установить
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, так как она нужна для `prisma generate`
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости (включая devDependencies) для всех воркспейсов.
# `prisma generate` запустится автоматически через postinstall скрипт.
RUN pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build

# --- Pruner Stage ---
# На этой стадии мы удаляем devDependencies, чтобы финальный образ был меньше.
FROM base AS pruner

WORKDIR /usr/src/app

# Копируем все из builder
COPY --from=builder /usr/src/app/ ./

# Удаляем все devDependencies, оставляя только production-зависимости
RUN pnpm prune --prod

# --- Runner Stage ---
# Финальный, легковесный образ для запуска приложения.
FROM base AS runner

WORKDIR /usr/src/app

# Копируем скомпилированный код из builder
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем только production-зависимости из pruner
COPY --from=pruner /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=pruner /usr/src/app/package.json .
COPY --from=pruner /usr/src/app/backend/package.json ./backend/

EXPOSE 3001
CMD ["pnpm", "start:backend"]
