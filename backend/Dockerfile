# Этап 1: Сборщик (Builder)
# Используем полный образ Node для обеспечения наличия всех сборочных зависимостей
FROM node:20 as builder

# Устанавливаем системные зависимости для Prisma
RUN apt-get update && apt-get install -y openssl

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Включаем pnpm через corepack
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma до установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies для сборки и генерации
# Запускаем prisma generate через postinstall скрипт
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем только бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 2: Очистка (Pruner)
# Используем тот же базовый образ, что и builder, чтобы pnpm работал корректно
FROM node:20 as pruner

WORKDIR /usr/src/app
RUN corepack enable

# Копируем только необходимые для деплоя артефакты
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Устанавливаем только production-зависимости для бэкенда
# ./ указывает, что установка должна производиться в текущую директорию (/usr/src/app)
# которая на данном шаге содержит только манифесты.
RUN pnpm deploy --legacy --prod --filter prodvor-backend ./

# Этап 3: Финальный образ (Runner)
# Используем легковесный alpine-образ для production
FROM node:20-alpine as runner

WORKDIR /app

# Устанавливаем системные зависимости для Prisma (openssl)
RUN apk add --no-cache openssl

# Копируем собранный код и production-зависимости из pruner'а
COPY --from=pruner /usr/src/app/backend ./backend
COPY --from=pruner /usr/src/app/node_modules ./node_modules

# Указываем команду для запуска приложения
CMD ["node", "backend/dist/main.js"]
