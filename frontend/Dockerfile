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

# Устанавливаем ВСЕ зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем только frontend, так как это Dockerfile для фронтенда
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
# Это финальный, легковесный образ для запуска приложения
FROM base as runner
WORKDIR /usr/src/app

# Копируем только необходимые артефакты из builder'а
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/
# Копируем production node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/frontend/node_modules ./frontend/node_modules


EXPOSE 9002

# Команда для запуска production-сборки
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
