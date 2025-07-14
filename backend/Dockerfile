# --- Base Stage ---
# Устанавливаем базовый образ и pnpm
FROM node:20-alpine as base
RUN npm install -g pnpm@10.13.1

# --- Dependencies Stage ---
# Устанавливаем ВСЕ зависимости, включая dev, для сборки
FROM base as builder
WORKDIR /usr/src/app
# Устанавливаем OpenSSL, необходимый для Prisma
RUN apk add --no-cache openssl
# Копируем все манифесты, чтобы pnpm понял структуру воркспейса
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Копируем схему Prisma ДО установки зависимостей
COPY backend/prisma ./backend/prisma
# Устанавливаем все зависимости. postinstall скрипт выполнит 'prisma generate'
RUN pnpm install --frozen-lockfile
# Копируем весь остальной код
COPY . .
# Собираем только backend
RUN pnpm --filter prodvor-backend build

# --- Pruner Stage ---
# Создаем чистую директорию с production-зависимостями
FROM base as pruner
WORKDIR /app
COPY --from=builder /usr/src/app/backend /app/backend
COPY --from=builder /usr/src/app/package.json /app/
COPY --from=builder /usr/src/app/pnpm-lock.yaml /app/
# ВАЖНО: Копируем workspace.yaml, чтобы pnpm deploy работал
COPY --from=builder /usr/src/app/pnpm-workspace.yaml /app/
RUN pnpm deploy --prod backend

# --- Runner Stage (финальный образ для production) ---
FROM base AS runner
WORKDIR /app
COPY --from=pruner /app/backend /app/backend
# Копируем package.json, чтобы команда 'start' работала
COPY --from=pruner /app/package.json /app/
# Запускаем приложение
CMD ["pnpm", "start:backend"]

# --- Migrations Stage (для CI) ---
FROM builder AS migrations
WORKDIR /app
COPY --from=builder /usr/src/app .
CMD ["pnpm", "--filter", "prodvor-backend", "prisma:migrate:deploy"]
