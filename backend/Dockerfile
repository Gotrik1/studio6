# === Base Stage: Установка зависимостей ===
FROM node:20 AS base
RUN apt-get update && apt-get install -y openssl

# === Builder Stage: Сборка приложения ===
FROM base AS builder
WORKDIR /usr/src/app

# Установка pnpm
RUN corepack enable

# Копируем ТОЛЬКО файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

# Установка всех зависимостей, включая devDependencies для сборки и генерации Prisma
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем весь остальной код ПОСЛЕ установки зависимостей
COPY . .

# Сборка бэкенда
RUN pnpm --filter prodvor-backend build

# === Pruner Stage: Подготовка production-зависимостей ===
FROM base AS pruner
WORKDIR /usr/src/app

# Установка pnpm
RUN corepack enable

# Копируем манифесты
COPY package.json pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Копируем скомпилированный код
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Установка ТОЛЬКО production-зависимостей
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-backend .

# === Runner Stage: Финальный образ ===
FROM node:20-alpine AS runner
WORKDIR /app

# Копируем production-зависимости и скомпилированный код
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend ./backend

# Устанавливаем пользователя без root прав для безопасности
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3001

CMD ["node", "backend/dist/main.js"]
