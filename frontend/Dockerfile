# -----------------------------------------------------------------------------
# Этап 1: base
# Установка базовых зависимостей, которые редко меняются
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /usr/src/app
# Глобальная установка pnpm
RUN npm install -g pnpm

# -----------------------------------------------------------------------------
# Этап 2: dependencies
# Установка всех зависимостей проекта. Этот слой будет кешироваться,
# если файлы package.json или pnpm-lock.yaml не изменились.
# -----------------------------------------------------------------------------
FROM base as dependencies
WORKDIR /usr/src/app

# Копируем корневые файлы для pnpm workspaces
COPY package.json pnpm-lock.yaml ./
# Копируем package.json фронтенда
COPY frontend/package.json ./frontend/
# Копируем package.json бэкенда, чтобы pnpm мог найти воркспейс
COPY backend/package.json ./backend/

# Устанавливаем все зависимости, включая devDependencies
RUN pnpm install

# -----------------------------------------------------------------------------
# Этап 3: builder
# Сборка проекта. Этот слой будет пересобираться только если изменился исходный код.
# -----------------------------------------------------------------------------
FROM dependencies AS builder
WORKDIR /usr/src/app

# Копируем весь исходный код фронтенда
COPY ./frontend .

# Собираем приложение
RUN pnpm --filter prodvor-frontend build

# -----------------------------------------------------------------------------
# Этап 4: runner
# Создание финального, легковесного образа для запуска приложения.
# -----------------------------------------------------------------------------
FROM base as runner
WORKDIR /usr/src/app

# Копируем только необходимые файлы из предыдущих этапов
COPY --from=dependencies /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml ./
COPY --from=dependencies /usr/src/app/frontend/package.json ./frontend/
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./frontend/.next
COPY --from=builder /usr/src/app/public ./frontend/public

# ENV NODE_ENV production
# Это важно для Next.js, чтобы он работал в режиме продакшена

EXPOSE 9002

CMD ["pnpm", "start:frontend"]
