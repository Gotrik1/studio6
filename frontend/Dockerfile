# Этап 1: Установка зависимостей и сборка
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Копируем манифесты пакетов
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies для сборки
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Собираем только фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Финальный образ для запуска
FROM node:20-alpine AS runner

WORKDIR /app

# Копируем необходимые файлы из builder'а
COPY --from=builder /usr/src/app/frontend/package.json ./package.json
COPY --from=builder /usr/src/app/frontend/.next ./.next
COPY --from=builder /usr/src/app/frontend/public ./public
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./
COPY --from=builder /usr/src/app/frontend/postcss.config.cjs ./
COPY --from=builder /usr/src/app/frontend/tailwind.config.ts ./
COPY --from=builder /usr/src/app/node_modules ./node_modules


# Запускаем приложение
CMD ["pnpm", "start"]
