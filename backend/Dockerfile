# --- Base Stage ---
FROM node:20-alpine as base
# Устанавливаем OpenSSL, необходимый для Prisma
RUN apk add --no-cache openssl
# Устанавливаем pnpm глобально в нужной версии
RUN npm install -g pnpm@10.13.1

# --- Builder Stage (для сборки и установки всех зависимостей) ---
FROM base as builder
WORKDIR /usr/src/app

# Копируем только манифесты для эффективного кэширования Docker-слоев
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Копируем схему Prisma до установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies
# Это также запустит `pnpm prisma:generate` через postinstall-скрипт
RUN pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем только backend
RUN pnpm --filter prodvor-backend build

# --- Pruner Stage (для production-зависимостей) ---
FROM base as pruner
WORKDIR /app
COPY --from=builder /usr/src/app/backend /app/backend
COPY --from=builder /usr/src/app/package.json /app/package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=builder /usr/src/app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
# Устанавливаем ТОЛЬКО production-зависимости для бэкенда
RUN pnpm deploy --prod --filter prodvor-backend

# --- Runner Stage (финальный образ для production) ---
FROM base AS runner
WORKDIR /app
COPY --from=pruner /app/backend /app/backend
COPY --from=pruner /app/node_modules /app/node_modules
# Устанавливаем рабочую директорию внутри воркспейса бэкенда
WORKDIR /app/backend
CMD ["node", "dist/main"]

# --- Migrations Stage (для CI/CD) ---
FROM builder AS migrations
WORKDIR /app
# Команда для запуска миграций
CMD ["pnpm", "--filter", "prodvor-backend", "prisma:migrate:deploy"]
