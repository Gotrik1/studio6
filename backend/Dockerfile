# Этап 1: Установка зависимостей и сборка
FROM node:20-alpine AS builder

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

# Копируем манифесты пакетов и schema.prisma
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies, чтобы запустить 'prisma generate' и 'build'
# 'pnpm install' автоматически вызовет 'prisma generate' через 'postinstall' скрипт
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Собираем только бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 2: Подготовка production-зависимостей
FROM node:20-alpine AS pruner

WORKDIR /usr/src/app

# Копируем собранный код и package.json из builder'а
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./

# Устанавливаем ТОЛЬКО production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --filter prodvor-backend

# Этап 3: Финальный образ для запуска
FROM node:20-alpine AS runner

# Устанавливаем OpenSSL, необходимый для Prisma в runtime
RUN apk add --no-cache openssl

WORKDIR /app

# Копируем production-зависимости и собранный код
COPY --from=pruner /usr/src/app/backend/dist ./dist
COPY --from=pruner /usr/src/app/backend/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/package.json ./

# Запускаем приложение
CMD ["node", "dist/main.js"]
