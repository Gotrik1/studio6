# --- Base Stage ---
FROM node:20-alpine AS base
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем корневые манифесты и tsconfig
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json .npmrc* ./

# Копируем схему Prisma до установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости (включая dev) для всех воркспейсов
RUN pnpm install --no-frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
# Prisma generate вызывается автоматически через postinstall скрипт в package.json
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
FROM base as runner
WORKDIR /usr/src/app

# Копируем только необходимые артефакты из builder
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

EXPOSE 3001
CMD ["pnpm", "start:backend"]
