# Этап 1: Сборка production-кода
FROM node:20 as builder

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Копируем только манифесты для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma до установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости. `pnpm` автоматически запустит `prisma generate`
# благодаря `postinstall` скрипту.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Копируем весь остальной код ПОСЛЕ установки зависимостей, чтобы не перезаписать node_modules
COPY . .

# Собираем только бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 2: Подготовка production-версии node_modules
FROM node:20 as pruner

WORKDIR /usr/src/app

# Включаем pnpm
RUN corepack enable

# Копируем только необходимые для деплоя файлы
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Устанавливаем только production-зависимости для бэкенда
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-backend ./backend

# Этап 3: Финальный, легковесный образ
FROM node:20-alpine as runner

WORKDIR /app

# Копируем собранный код и production-зависимости
COPY --from=pruner /usr/src/app/backend .

# Запускаем приложение
CMD ["node", "dist/main.js"]
