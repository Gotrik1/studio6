# Этап 1: Базовый образ для зависимостей и сборки
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

# Этап 2: Установка зависимостей и сборка проекта
FROM base as builder
WORKDIR /usr/src/app

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma до установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем зависимости и ГАРАНТИРОВАННО генерируем Prisma Client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile && \
    pnpm --filter prodvor-backend prisma:generate

# Копируем весь остальной код ПОСЛЕ генерации клиента
COPY . .

# Собираем проект
RUN pnpm --filter prodvor-backend build

# Этап 3: Подготовка production-зависимостей
FROM base as pruner
WORKDIR /usr/src/app

# Копируем собранный проект и необходимые манифесты
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/

# Устанавливаем ТОЛЬКО production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm deploy --legacy --prod --filter prodvor-backend ./backend

# Этап 4: Финальный, легковесный образ
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем OpenSSL, т.к. он нужен Prisma для работы
RUN apk add --no-cache openssl

# Копируем production-зависимости и собранный код
COPY --from=pruner /usr/src/app/backend ./backend

# Указываем, какую команду запускать
CMD ["node", "backend/dist/main.js"]
