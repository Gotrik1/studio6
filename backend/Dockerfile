# Этап 1: Установка зависимостей и сборка проекта
FROM node:20 as builder

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем корневые манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем манифесты КАЖДОГО воркспейса, чтобы pnpm "увидел" их
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma ДО установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies. 
# На этом шаге автоматически запустится `prisma generate` из postinstall скрипта.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем ВЕСЬ остальной код
COPY . .

# Компилируем TypeScript в JavaScript. Prisma Client уже сгенерирован и доступен.
RUN pnpm --filter prodvor-backend build

# Этап 2: Подготовка production-версии node_modules
FROM node:20 as pruner

WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем только то, что нужно для production-установки
COPY pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Устанавливаем только production-зависимости для бэкенда
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --filter prodvor-backend

# Этап 3: Финальный легковесный образ
FROM node:20-alpine as runner

WORKDIR /app

# Устанавливаем OpenSSL, который нужен Prisma для работы
RUN apk add --no-cache openssl

# Копируем скомпилированный код и production-зависимости
COPY --from=pruner /usr/src/app/backend/dist ./dist
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/package.json ./package.json

# Указываем пользователя для безопасности
USER node

# Команда для запуска приложения
CMD ["node", "dist/main.js"]
