# Dockerfile для фронтенда (Next.js)

# --- Этап 1: Сборщик (Builder) ---
FROM node:20-alpine AS builder

# Установка зависимостей pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Копирование файлов манифеста для эффективного кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Установка всех зависимостей, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копирование исходного кода фронтенда
COPY frontend/ ./frontend/

# Явно указываем путь к исполняемым файлам pnpm
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Сборка Next.js приложения
RUN pnpm --filter prodvor-frontend build

# --- Этап 2: Запуск (Runner) ---
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Установка зависимостей pnpm
RUN npm install -g pnpm

# Копирование файлов манифеста для установки только production-зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Установка только production-зависимостей для уменьшения размера образа
RUN pnpm install --prod --frozen-lockfile

# Копирование собранного приложения из builder
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json

# Установка текущего пользователя как "node" для безопасности
USER node

# Команда для запуска приложения
CMD ["pnpm", "start:frontend"]
