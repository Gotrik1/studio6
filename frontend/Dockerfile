# -----------------------------------------------------------------
# Этап 1: Установка базовых зависимостей
# -----------------------------------------------------------------
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

# -----------------------------------------------------------------
# Этап 2: Установка всех зависимостей и сборка проекта
# -----------------------------------------------------------------
FROM base as builder
WORKDIR /usr/src/app

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, чтобы она была доступна для генерации
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости (включая devDependencies) и генерируем Prisma Client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# -----------------------------------------------------------------
# Этап 3: Подготовка production-версии node_modules
# -----------------------------------------------------------------
FROM base as pruner
WORKDIR /usr/src/app

# Копируем только необходимые для деплоя файлы из builder
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/

# Устанавливаем только production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --prod --filter prodvor-frontend ./frontend

# -----------------------------------------------------------------
# Этап 4: Финальный легковесный образ
# -----------------------------------------------------------------
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем системные зависимости, если они нужны для рантайма
RUN apk add --no-cache openssl

# Копируем собранный проект и production-версию node_modules
COPY --from=pruner /usr/src/app/frontend .

EXPOSE 9002

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["pnpm", "start:frontend"]
