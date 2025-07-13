# 1. Builder stage: Установка зависимостей, компиляция и генерация Prisma
FROM node:20 AS builder

# Установка рабочей директории
WORKDIR /usr/src/app

# Копируем файлы манифеста из корня монорепозитория
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса для корректного кэширования pnpm install
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Установка системных зависимостей, необходимых для Prisma (например, OpenSSL)
RUN apt-get update && apt-get install -y openssl

# Установка зависимостей с помощью pnpm
RUN npm install -g pnpm@9.15.9
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код проекта
COPY . .

# Генерируем Prisma Client, чтобы он был доступен во время сборки
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд приложение. Команда `nest build` скомпилирует TS в JS в папку `dist`
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Создание легковесного образа для продакшена
FROM node:20-slim AS runner

# Установка рабочей директории
WORKDIR /usr/src/app

# Копируем файлы манифеста из корня монорепозитория
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json бэкенда
COPY backend/package.json ./backend/

# Устанавливаем ТОЛЬКО production-зависимости. Dev-зависимости не нужны в production-образе.
RUN npm install -g pnpm@9.15.9
RUN pnpm install --prod --frozen-lockfile

# Копируем скомпилированный код из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем схему Prisma для выполнения миграций в CI/CD
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Копируем сгенерированный Prisma Client и его движки из builder-стадии
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/.pnpm/@prisma+engines* ./node_modules/.pnpm/@prisma+engines

# Указываем команду для запуска приложения
CMD ["node", "backend/dist/main"]
