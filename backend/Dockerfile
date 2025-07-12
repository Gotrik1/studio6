# Stage 1: Установка зависимостей
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

# Копируем package.json и pnpm-lock.yaml из корня монорепозитория
COPY pnpm-lock.yaml ./
COPY package.json ./

# Копируем package.json бэкенда
COPY package.json ./backend/
# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------

# Stage 2: Сборка приложения
FROM dependencies AS builder
WORKDIR /usr/src/app

# Копируем исходный код бэкенда
COPY ./backend/ ./backend/

# Генерируем Prisma Client (требует devDependencies, установленных ранее)
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем приложение
RUN pnpm --filter prodvor-backend build

# -----------------------------------------------------------------------------

# Stage 3: Финальный образ
from node:20-alpine as runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Устанавливаем OpenSSL
RUN apk add --no-cache openssl

# Копируем только production-зависимости из builder-стадии
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules

# Копируем собранное приложение
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/

# Копируем Prisma schema для runtime
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

EXPOSE 3001
CMD ["node", "backend/dist/main"]
