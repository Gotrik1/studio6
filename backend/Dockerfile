# Этап 1: Установка зависимостей и сборка проекта
FROM node:20 AS builder

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Включаем corepack для управления pnpm
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma/schema.prisma ./backend/prisma/

# Устанавливаем ВСЕ зависимости (включая dev), чтобы сработал prisma generate
# Prisma Client будет сгенерирован на этом шаге через хук postinstall
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной код проекта ПОСЛЕ установки зависимостей
COPY . .

# Собираем только бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 2: Подготовка production-версии node_modules
FROM node:20 AS pruner

WORKDIR /usr/src/app

# Включаем corepack для управления pnpm
RUN corepack enable

COPY pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Устанавливаем только production-зависимости для бэкенда
RUN pnpm deploy --prod --filter prodvor-backend ./backend

# Этап 3: Финальный легковесный образ
FROM node:20-slim AS runner

WORKDIR /app

# Устанавливаем OpenSSL для runtime
RUN apt-get update && apt-get install -y openssl

# Копируем только скомпилированный код и production-зависимости
COPY --from=pruner /usr/src/app/backend/dist ./dist
COPY --from=pruner /usr/src/app/backend/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/package.json ./package.json

EXPOSE 3001

CMD ["node", "dist/main.js"]
