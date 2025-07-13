# 1. Builder stage: Устанавливаем зависимости и собираем приложение
FROM node:20 AS builder

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# Указываем рабочую директорию
WORKDIR /usr/src/app

# Глобально устанавливаем pnpm
RUN npm install -g pnpm@9.15.9

# Копируем файлы манифеста для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код проекта
COPY . .

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем NestJS приложение
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Создаем легковесный образ для запуска
FROM node:20-slim AS runner

# Устанавливаем OpenSSL
RUN apt-get update && apt-get install -y openssl

# Указываем рабочую директорию
WORKDIR /usr/src/app

# Глобально устанавливаем pnpm
RUN npm install -g pnpm@9.15.9

# Копируем файлы манифеста для установки production-зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Устанавливаем только production-зависимости
RUN pnpm --filter prodvor-backend... install --prod --frozen-lockfile

# Копируем собранное приложение из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Указываем команду для запуска приложения в формате exec
CMD ["pnpm", "start:backend"]
