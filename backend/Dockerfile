# -- STAGE 1: BASE --
# Базовый образ с Node.js и необходимыми системными зависимостями
FROM node:20 as base
# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# -- STAGE 2: BUILDER --
# Этот этап отвечает за сборку TypeScript-кода в JavaScript.
FROM base AS builder

# 1. Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# 2. Копируем только файлы-манифесты для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# 3. Копируем схему Prisma до установки зависимостей
COPY backend/prisma ./backend/prisma

# 4. Устанавливаем все зависимости и генерируем Prisma Client
#    Скрипт `postinstall` в package.json автоматически вызовет `prisma:generate`
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# 5. Копируем весь остальной исходный код
COPY . .

# 6. Собираем только бэкенд-воркспейс
RUN pnpm --filter prodvor-backend build


# -- STAGE 3: PRUNER --
# Этот этап нужен для того, чтобы в финальном образе были только production-зависимости
FROM base AS pruner

# 1. Устанавливаем рабочую директорию
WORKDIR /app

# 2. Активируем pnpm
RUN corepack enable

# 3. Копируем скомпилированный проект и package.json
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./

# 4. Устанавливаем ТОЛЬКО production-зависимости, используя deploy
RUN pnpm deploy --legacy --prod --filter prodvor-backend

# -- STAGE 4: RUNNER --
# Финальный, легковесный образ для запуска приложения.
FROM node:20-alpine AS runner

# 1. Устанавливаем рабочую директорию
WORKDIR /app

# 2. Устанавливаем OpenSSL, который все еще нужен Prisma Client для работы
RUN apk add --no-cache openssl

# 3. Копируем собранный проект и production-зависимости из `pruner`
COPY --from=pruner /app/backend .
COPY --from=pruner /app/node_modules ./node_modules

# 4. Устанавливаем пользователя без root-прав для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# 5. Указываем порт
EXPOSE 3001

# 6. Команда для запуска
CMD ["node", "dist/main"]
