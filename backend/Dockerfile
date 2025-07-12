# ==============================================================================
# Этап 1: Base - Общая основа для установки зависимостей
# ==============================================================================
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

# ==============================================================================
# Этап 2: Dependencies - Установка всех зависимостей проекта
# ==============================================================================
FROM base AS dependencies

# Копируем корневые package.json и pnpm-lock.yaml, а также файл конфигурации воркспейсов
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml* ./

# Копируем package.json бэкенда
COPY backend/package.json ./backend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN pnpm install --frozen-lockfile

# ==============================================================================
# Этап 3: Build - Сборка приложения
# ==============================================================================
FROM dependencies AS build

# Копируем весь исходный код
COPY . .

# Генерируем Prisma Client (требует devDependencies, установленных ранее)
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем приложение
RUN pnpm --filter prodvor-backend build

# ==============================================================================
# Этап 4: Runner - Финальный, легковесный образ для запуска
# ==============================================================================
from base as runner
WORKDIR /usr/src/app

# Устанавливаем переменную окружения для production
ENV NODE_ENV production

# Добавляем бинарники из node_modules в PATH
# Это необходимо для запуска `nest` без полного пути
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Копируем только production-зависимости из этапа 'build'
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=build /usr/src/app/package.json ./package.json

# Копируем собранное приложение
COPY --from=build /usr/src/app/backend/dist ./backend/dist
COPY --from=build /usr/src/app/backend/prisma ./backend/prisma

# Запускаем приложение в production-режиме
CMD ["pnpm", "--filter", "prodvor-backend", "start:prod"]
