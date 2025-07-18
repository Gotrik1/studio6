# Этап 1: Сборка проекта
FROM node:20 as builder

# Устанавливаем системные зависимости, необходимые для Prisma
RUN apt-get update && apt-get install -y openssl

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma

# Устанавливаем зависимости (включая devDependencies для сборки и генерации Prisma)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Собираем бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 2: Оптимизация node_modules для продакшена
FROM node:20 as pruner

WORKDIR /usr/src/app

# Включаем corepack
RUN corepack enable

# Копируем только необходимые для деплоя файлы из сборщика
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/

# Устанавливаем только production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter prodvor-backend deploy --prod ./backend

# Этап 3: Финальный образ
FROM node:20-alpine as runner

# Устанавливаем OpenSSL, необходимый для Prisma в рантайме
RUN apk add --no-cache openssl

WORKDIR /app

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Копируем оптимизированные node_modules и собранный проект из pruner
COPY --from=pruner /usr/src/app/backend/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/dist ./dist
COPY --from=pruner /usr/src/app/backend/package.json ./

# Указываем команду для запуска приложения
CMD ["node", "dist/main.js"]
