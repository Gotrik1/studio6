# === STAGE 1: Builder ===
# Этот этап устанавливает все зависимости (включая dev) и компилирует проект.
FROM node:20 as builder

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем корневые файлы манифеста
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma ДО установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies.
# На этом этапе автоматически сработает `prisma generate` из postinstall-скрипта.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем ВЕСЬ остальной исходный код (после установки зависимостей, чтобы не перезаписывать node_modules)
COPY . .

# Собираем только бэкенд-проект
RUN pnpm --filter prodvor-backend build

# === STAGE 2: Pruner ===
# Этот этап удаляет все dev-зависимости, оставляя только production.
FROM node:20 as pruner

WORKDIR /usr/src/app

# Включаем corepack
RUN corepack enable

# Копируем только артефакты сборки и package.json из builder'а
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml
# Prisma Client содержит сгенерованные файлы, которые нужны в рантайме
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Устанавливаем ТОЛЬКО production-зависимости для бэкенда.
# Команда `deploy` специально создана для таких сценариев.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --prod --filter prodvor-backend ./backend

# === STAGE 3: Runner ===
# Финальный, легковесный образ для запуска приложения.
FROM node:20-alpine

# Устанавливаем OpenSSL, необходимый для Prisma в рантайме
RUN apk add --no-cache openssl

WORKDIR /app

# Копируем собранный проект и production-версию node_modules
COPY --from=pruner /usr/src/app/backend/dist ./dist
COPY --from=pruner /usr/src/app/backend/package.json ./package.json
COPY --from=pruner /usr/src/app/backend/node_modules ./node_modules
# Копируем схему и Prisma client, необходимые для работы в рантайме
COPY --from=builder /usr/src/app/backend/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./.prisma

# Открываем порт
EXPOSE 3001

# Устанавливаем команду для запуска
CMD ["node", "dist/main.js"]
