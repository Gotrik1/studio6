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
# Копируем package.json бэкенда
COPY backend/package.json ./backend/
# Копируем package.json фронтенда, чтобы pnpm мог найти воркспейс
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN pnpm install

# -----------------------------------------------------------------------------
# Этап 3: builder
# Сборка проекта. Этот слой будет пересобираться только если изменился исходный код.
# -----------------------------------------------------------------------------
FROM dependencies AS builder
WORKDIR /usr/src/app

# Копируем весь исходный код бэкенда
COPY ./backend .

# Генерируем Prisma Client (требует devDependencies, установленных ранее)
RUN pnpm prisma:generate

# Собираем приложение
RUN pnpm build

# -----------------------------------------------------------------------------
# Этап 4: runner
# Создание финального, легковесного образа для запуска приложения.
# -----------------------------------------------------------------------------
from base as runner
WORKDIR /usr/src/app

# Копируем только необходимые файлы из предыдущих этапов
COPY --from=dependencies /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml ./
COPY --from=dependencies /usr/src/app/backend/package.json ./backend/
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3001

CMD ["pnpm", "start:backend"]
