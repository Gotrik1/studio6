# 1. Builder stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Добавляем путь к исполняемым файлам pnpm в PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Копируем файлы манифеста для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходный код
COPY . .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# 2. Runner stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Копируем файлы манифеста для установки ТОЛЬКО production-зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/

# Устанавливаем только production-зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем собранное приложение из builder-стадии
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Открываем порт, на котором будет работать приложение
EXPOSE 9002

# Команда для запуска приложения
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
