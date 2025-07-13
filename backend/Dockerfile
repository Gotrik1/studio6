# --- Base Stage ---
# Используем легковесный образ с Node.js
FROM node:20-alpine AS base
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
# Эта стадия используется для сборки TypeScript в JavaScript
FROM base as builder
WORKDIR /usr/src/app

# Копируем только файлы манифеста, чтобы кэшировать слой зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json .npmrc* ./
# Копируем package.json каждого воркспейса для корректной установки
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma до установки, так как postinstall скрипт её использует
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies, чтобы были доступны CLI-инструменты
RUN pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
# Prisma generate вызывается автоматически через postinstall скрипт в package.json
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
# Это финальный, легковесный образ для запуска приложения
FROM base as runner
WORKDIR /usr/src/app

# Копируем только необходимые артефакты из builder'а
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Копируем production node_modules вместе со сгенерированным Prisma клиентом
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

EXPOSE 3001

# Команда для запуска production-сборки
CMD ["node", "backend/dist/main"]
