# Этап 1: Установка зависимостей и сборка
FROM node:20 as builder

# Устанавливаем системные зависимости, включая OpenSSL для Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем только файлы, необходимые для установки зависимостей
# Это позволяет кэшировать слой с node_modules, если зависимости не менялись
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости (включая dev), что автоматически запускает prisma generate
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ЯВНЫЙ ЗАПУСК ГЕНЕРАЦИИ PRISMA CLIENT (Ключевое исправление)
# Этот шаг гарантирует, что клиент будет сгенерирован даже если postinstall не сработал
RUN pnpm --filter prodvor-backend prisma:generate

# Копируем остальной код проекта ПОСЛЕ установки зависимостей
COPY . .

# Собираем только нужный воркспейс
RUN pnpm --filter prodvor-backend build

# Этап 2: Оптимизация production-зависимостей
FROM builder as pruner
WORKDIR /usr/src/app
RUN pnpm deploy --prod --filter prodvor-backend /prod

# Этап 3: Финальный легковесный образ
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем OpenSSL, т.к. он нужен Prisma и в рантайме
RUN apk add --no-cache openssl

# Копируем production-зависимости и скомпилированный код
COPY --from=pruner /prod/node_modules ./node_modules
COPY --from=pruner /prod/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main.js"]
