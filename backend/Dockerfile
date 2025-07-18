# Dockerfile для NestJS (Backend)

# Этап 1: Базовый образ с зависимостями
FROM node:20 as base
# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# Этап 2: Установка зависимостей и сборка
FROM base as builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Включаем corepack для управления pnpm
RUN corepack enable

# Копируем корневые файлы манифеста
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса, чтобы pnpm понял структуру
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies.
# На этом этапе автоматически выполнится 'prisma generate' из-за postinstall скрипта.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем ВЕСЬ остальной код ПОСЛЕ установки зависимостей, чтобы не перезаписать node_modules
COPY . .

# Собираем конкретный воркспейс (backend)
RUN pnpm --filter prodvor-backend build

# Этап 3: Подготовка production-зависимостей
FROM base as pruner
WORKDIR /usr/src/app
RUN corepack enable
COPY pnpm-workspace.yaml ./

# Копируем собранный проект и его package.json
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Копируем схему для runtime
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Устанавливаем ТОЛЬКО production-зависимости для бэкенда
RUN pnpm deploy --legacy --prod --filter prodvor-backend /prod

# Этап 4: Финальный образ
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем OpenSSL для runtime
RUN apk add --no-cache openssl

# Копируем production-зависимости и собранный проект
COPY --from=pruner /prod/backend .
COPY --from=pruner /prod/node_modules ./node_modules

# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/node_modules/.pnpm/@prisma+client* ./node_modules/.pnpm/

# Запускаем приложение
CMD ["node", "dist/main"]
