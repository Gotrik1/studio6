# -----------------------------------------------------------------------------
# Этап 1: Установка зависимостей
# -----------------------------------------------------------------------------
FROM node:20-alpine AS dependencies

WORKDIR /usr/src/app

# Установка OpenSSL
RUN apk add --no-cache openssl

# Копируем корневые файлы для установки зависимостей воркспейса
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Копируем package.json бэкенда
COPY backend/package.json ./backend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --filter prodvor-backend

# -----------------------------------------------------------------------------
# Этап 2: Сборка проекта
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Копируем зависимости из предыдущего этапа
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/backend/node_modules ./backend/node_modules

# Копируем исходный код
COPY backend/ ./backend/
COPY prisma/ ./prisma/
# Копируем корневой tsconfig, чтобы NestJS мог его найти
COPY tsconfig.json .
COPY package.json .

# Добавляем nest в PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем приложение
RUN pnpm --filter prodvor-backend build

# -----------------------------------------------------------------------------
# Финальный этап: Production-образ
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Установка OpenSSL для Prisma
RUN apk add --no-cache openssl

# Копируем только production-зависимости
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules

# Копируем собранный код
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

USER node

EXPOSE 3001

CMD ["node", "backend/dist/main"]
