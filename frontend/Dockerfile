# === Base Stage: Установка зависимостей ===
FROM node:20 AS base

# === Builder Stage: Сборка приложения ===
FROM base AS builder
WORKDIR /usr/src/app

# Установка pnpm
RUN corepack enable

# Копируем ТОЛЬКО файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Установка всех зависимостей, включая devDependencies для сборки
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем весь остальной код ПОСЛЕ установки зависимостей
COPY . .

# Сборка фронтенда
RUN pnpm --filter prodvor-frontend build

# === Pruner Stage: Подготовка production-зависимостей ===
FROM base AS pruner
WORKDIR /prod

# Установка pnpm
RUN corepack enable

# Копируем манифесты в корень /prod
COPY pnpm-workspace.yaml package.json ./
COPY frontend/package.json ./frontend/package.json

# Установка ТОЛЬКО production-зависимостей
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-frontend ./

# Копируем скомпилированный код
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# === Runner Stage: Финальный образ ===
FROM node:20-alpine AS runner
WORKDIR /app

# Копируем production-зависимости и скомпилированный код
COPY --from=pruner /prod/node_modules ./node_modules
COPY --from=pruner /prod/frontend ./frontend
COPY --from=pruner /prod/public ./public

# Устанавливаем пользователя без root прав для безопасности
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 9002

CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
