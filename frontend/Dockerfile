#
# ---- 1. Base Stage: Установка зависимостей ----
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

#
# ---- 2. Builder Stage: Сборка приложения ----
FROM base as builder
WORKDIR /usr/src/app

# Копируем только манифесты для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, чтобы Prisma Client мог сгенерироваться
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies.
# На этом шаге автоматически запускается `prisma generate` через postinstall.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем конкретный воркспейс
RUN pnpm --filter prodvor-frontend build

#
# ---- 3. Pruner Stage: Подготовка production-зависимостей ----
FROM base as pruner
WORKDIR /usr/src/app

# Копируем артефакты сборки и необходимые манифесты
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/

# Устанавливаем только production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --prod --filter prodvor-frontend ./frontend

#
# ---- 4. Runner Stage: Финальный легковесный образ ----
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем системные зависимости
RUN apk add --no-cache openssl

# Копируем собранное приложение и production-зависимости
COPY --from=pruner /usr/src/app/frontend ./frontend
COPY --from=pruner /usr/src/app/node_modules ./node_modules

# Устанавливаем пользователя без root-прав для безопасности
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser

EXPOSE 9002

# Запускаем приложение
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
