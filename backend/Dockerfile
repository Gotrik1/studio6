# 1. Builder stage: Устанавливаем зависимости и собираем приложение
FROM node:20 AS builder

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@9.15.9

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код проекта
# Это делается после установки зависимостей для лучшего кэширования
COPY . .

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд-приложение
RUN pnpm --filter prodvor-backend build


# 2. Runner stage: Создаем легковесный образ для запуска
FROM node:20-slim

# Устанавливаем OpenSSL, необходимый для Prisma в production
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Копируем только production-зависимости из builder-стадии
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml .
COPY --from=builder /usr/src/app/pnpm-workspace.yaml .

# Копируем собранное приложение из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Указываем команду для запуска приложения
CMD ["pnpm", "start:backend"]
