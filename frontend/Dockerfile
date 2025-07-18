# Этап 1: Сборка production-кода
FROM node:20 as builder

WORKDIR /usr/src/app

# Копируем только манифесты для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Копируем весь остальной код ПОСЛЕ установки зависимостей
COPY . .

# Собираем только фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Подготовка production-версии node_modules
FROM node:20 as pruner

WORKDIR /usr/src/app

# Включаем pnpm
RUN corepack enable

# Копируем только необходимые для деплоя файлы
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/.next/standalone ./frontend/.next/standalone
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Устанавливаем только production-зависимости для фронтенда
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-frontend ./frontend

# Этап 3: Финальный, легковесный образ
FROM node:20-alpine as runner

WORKDIR /app

# Копируем собранный код и production-зависимости
COPY --from=pruner /usr/src/app/frontend .

# Запускаем приложение
CMD ["node", ".next/standalone/server.js"]
