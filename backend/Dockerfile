#
# ---- 1. Base Stage: Установка зависимостей ----
FROM node:20 as base
# Устанавливаем OpenSSL, необходимый для Prisma
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
# Это происходит ПОСЛЕ установки, чтобы не перезаписать сгенерированный Prisma Client
COPY . .

# Собираем конкретный воркспейс
RUN pnpm --filter prodvor-backend build

#
# ---- 3. Pruner Stage: Подготовка production-зависимостей ----
# Этот этап создает чистую установку только с production-зависимостями
FROM base as pruner
WORKDIR /usr/src/app

# Копируем артефакты сборки и необходимые манифесты из builder
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./

# Устанавливаем только production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --prod --filter prodvor-backend

#
# ---- 4. Runner Stage: Финальный легковесный образ ----
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем системные зависимости
RUN apk add --no-cache openssl

# Копируем собранное приложение и production-зависимости из pruner
COPY --from=pruner /usr/src/app/backend ./backend
COPY --from=pruner /usr/src/app/node_modules ./node_modules
# Копируем схему Prisma, необходимую для запуска
COPY backend/prisma ./backend/prisma

# Устанавливаем пользователя без root-прав для безопасности
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser

EXPOSE 3001

# Запускаем приложение
CMD ["pnpm", "--filter", "prodvor-backend", "start:prod"]
