# -----------------------------------------------------------------
# Этап 1: Установка базовых зависимостей
# -----------------------------------------------------------------
FROM node:20 as base
# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# -----------------------------------------------------------------
# Этап 2: Установка всех зависимостей и сборка проекта
# -----------------------------------------------------------------
FROM base as builder
WORKDIR /usr/src/app

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса, чтобы pnpm их увидел
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, чтобы она была доступна для генерации
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости (включая devDependencies)
# --mount=type=cache позволяет кэшировать pnpm store между сборками
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Явно запускаем генерацию Prisma Client после установки
RUN pnpm --filter prodvor-backend prisma:generate

# Копируем остальной исходный код ПОСЛЕ установки зависимостей
# Это гарантирует, что сгенерированный Prisma Client не будет перезаписан
COPY . .

# Собираем бэкенд
RUN pnpm --filter prodvor-backend build

# -----------------------------------------------------------------
# Этап 3: Подготовка production-версии node_modules
# -----------------------------------------------------------------
FROM base as pruner
WORKDIR /usr/src/app

# Копируем только необходимые для деплоя файлы из builder
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Устанавливаем только production-зависимости
# Флаг --legacy необходим для pnpm v9+, чтобы он работал как раньше
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-backend ./backend

# -----------------------------------------------------------------
# Этап 4: Финальный легковесный образ
# -----------------------------------------------------------------
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем системные зависимости, если они нужны для рантайма
RUN apk add --no-cache openssl

# Копируем собранный проект и production-версию node_modules
COPY --from=pruner /usr/src/app/backend .
# Копируем схему Prisma для рантайма
COPY --from=builder /usr/src/app/backend/prisma ./prisma

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/main"]
