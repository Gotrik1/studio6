# Этап 1: Сборщик (Builder)
FROM node:20 as builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Включаем pnpm через corepack
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies для сборки
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем только фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Очистка (Pruner)
# Используем тот же базовый образ, что и builder
FROM node:20 as pruner

WORKDIR /usr/src/app
RUN corepack enable

# Копируем только необходимые для деплоя артефакты
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/.next/standalone ./frontend/.next/standalone
COPY --from=builder /usr/src/app/frontend/.next/static ./frontend/.next/static

# Устанавливаем только production-зависимости для фронтенда
RUN pnpm deploy --legacy --prod --filter prodvor-frontend ./

# Этап 3: Финальный образ (Runner)
# Используем легковесный alpine-образ для production
FROM node:20-alpine as runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Копируем собранный код и production-зависимости из pruner'а
COPY --from=pruner /usr/src/app/frontend ./frontend
COPY --from=pruner /usr/src/app/node_modules ./node_modules

# Указываем команду для запуска приложения
CMD ["node", "frontend/standalone/server.js"]
