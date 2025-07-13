# 1. Builder stage: Установка зависимостей и сборка приложения
FROM node:20 AS builder

# Установка рабочей директории
WORKDIR /usr/src/app

# Копируем файлы манифеста из корня монорепозитория
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса для корректного кэширования pnpm install
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Установка зависимостей с помощью pnpm
RUN npm install -g pnpm@9.15.9
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код проекта
COPY . .

# Собираем фронтенд приложение. Команда `next build` создаст оптимизированную сборку в папке `.next`
RUN pnpm --filter prodvor-frontend build

# 2. Runner stage: Создание легковесного образа для продакшена
FROM node:20-slim AS runner

# Установка рабочей директории
WORKDIR /usr/src/app

# Устанавливаем pnpm для запуска приложения
RUN npm install -g pnpm@9.15.9

# Копируем package.json фронтенда
COPY frontend/package.json ./frontend/
# Копируем корневой package.json, чтобы pnpm мог найти воркспейс
COPY package.json .

# Устанавливаем ТОЛЬКО production-зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем скомпилированное приложение из builder-стадии
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next

# Копируем публичные ассеты
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Копируем next.config.mjs, если он существует
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/next.config.mjs

# Копируем команду для старта из корневого package.json
COPY --from=builder /usr/src/app/package.json .

# Указываем команду для запуска приложения
# Мы используем скрипт из корневого package.json для консистентности
CMD ["pnpm", "start:frontend"]
