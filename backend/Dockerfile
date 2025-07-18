# Этап 1: Установка зависимостей и сборка проекта
FROM node:20 as builder

# Устанавливаем системные зависимости, необходимые для Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Включаем pnpm через corepack
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса для корректной установки
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma до установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости. pnpm автоматически запустит `prisma generate` через postinstall
# --frozen-lockfile гарантирует, что будут установлены версии из лок-файла
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной код проекта ПОСЛЕ установки зависимостей
# Это предотвращает перезапись сгенерированного Prisma Client
COPY . .

# Собираем только бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 2: Оптимизация node_modules для production
FROM node:20 as pruner
WORKDIR /usr/src/app

# Включаем pnpm через corepack
RUN corepack enable

# Копируем только необходимые для деплоя манифесты
COPY pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем только скомпилированный бэкенд
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Устанавливаем ТОЛЬКО production-зависимости для бэкенда.
# Точка в конце указывает, что разворачивать нужно в текущий WORKDIR
RUN pnpm deploy --legacy --prod --filter prodvor-backend ./

# Этап 3: Финальный легковесный образ
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем OpenSSL, т.к. он нужен Prisma для запуска
RUN apk add --no-cache openssl

# Копируем собранный проект и production-версию node_modules из pruner
COPY --from=pruner /usr/src/app .

# Запускаем приложение
CMD ["node", "backend/dist/main"]
