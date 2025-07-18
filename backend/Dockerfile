# Этап 1: Сборка приложения
FROM node:20 AS builder

# Установка системных зависимостей, необходимых для Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Включаем pnpm
RUN corepack enable

# Копируем манифесты зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса для корректной установки
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma ДО установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости (включая devDependencies)
# Это нужно для сборки и генерации Prisma Client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Генерация Prisma Client
# postinstall скрипт уже должен был сработать, но для надежности можно добавить явный вызов
# RUN pnpm --filter prodvor-backend prisma:generate

# Копируем весь остальной код
COPY . .

# Собираем бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 2: Подготовка production-зависимостей
FROM node:20 AS pruner

WORKDIR /usr/src/app

# Включаем pnpm
RUN corepack enable

# Копируем манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем собранный код из builder
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Копируем Prisma schema
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma
# Копируем сгенерированный Prisma client
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Устанавливаем ТОЛЬКО production-зависимости, игнорируя postinstall скрипты
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --ignore-scripts

# Этап 3: Финальный образ
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Устанавливаем системные зависимости, необходимые для Prisma в Alpine
RUN apk add --no-cache openssl

# Копируем production-зависимости и собранный код из pruner
COPY --from=pruner /usr/src/app/backend ./backend
COPY --from=pruner /usr/src/app/node_modules ./node_modules

# Устанавливаем пользователя
USER node

# Команда для запуска приложения
CMD ["node", "backend/dist/main"]
