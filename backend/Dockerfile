# --- Base Stage ---
# Общий базовый слой для установки Node.js и pnpm.
FROM node:20-alpine as base
# Устанавливаем OpenSSL, необходимый для Prisma
RUN apk add --no-cache openssl
# Устанавливаем pnpm глобально
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
# Эта стадия собирает приложение и устанавливает ВСЕ зависимости.
FROM base AS builder
WORKDIR /usr/src/app

# Копируем манифесты для установки всех зависимостей монорепозитория
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Копируем package.json воркспейсов, чтобы pnpm понял, что устанавливать
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Копируем схему Prisma ДО установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies.
# На этом шаге Prisma Client генерируется автоматически через postinstall.
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только backend
RUN pnpm --filter prodvor-backend build

# --- Migrations Stage ---
# Эта стадия предназначена для запуска миграций в CI.
# Она содержит devDependencies, такие как Prisma CLI.
FROM builder AS migrations
WORKDIR /app
COPY --from=builder /usr/src/app .

# --- Pruner Stage (для production-зависимостей) ---
# Эта стадия нужна, чтобы отделить только production-зависимости.
FROM builder AS pruner
WORKDIR /app
# Копируем только нужные файлы для pnpm deploy
COPY --from=builder /usr/src/app/backend /app/backend
COPY --from=builder /usr/src/app/package.json /app/
COPY --from=builder /usr/src/app/pnpm-lock.yaml /app/
# Устанавливаем ТОЛЬКО production-зависимости для бэкенда
RUN pnpm deploy --prod backend

# --- Runner Stage (финальный образ для production) ---
# Этот образ будет использоваться для запуска самого приложения.
# Он легковесный и содержит только то, что нужно для работы.
FROM base AS runner
WORKDIR /app
COPY --from=pruner /app/backend /app/backend
COPY --from=pruner /app/package.json /app/
CMD ["pnpm", "--filter", "prodvor-backend", "start:prod"]
