# Этап 1: Базовый образ для зависимостей и сборки
FROM node:20 as base

# Этап 2: Установка зависимостей и сборка проекта
FROM base as builder
WORKDIR /usr/src/app

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем проект
RUN pnpm --filter prodvor-frontend build

# Этап 3: Подготовка production-зависимостей
FROM base as pruner
WORKDIR /usr/src/app

# Копируем собранный проект и необходимые манифесты
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Устанавливаем ТОЛЬКО production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm deploy --legacy --prod --filter prodvor-frontend ./frontend


# Этап 4: Финальный, легковесный образ
FROM node:20-alpine as runner
WORKDIR /app

# Копируем production-зависимости и собранный код
COPY --from=pruner /usr/src/app/frontend ./frontend

# Указываем, какую команду запускать
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
