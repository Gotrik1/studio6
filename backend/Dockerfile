# --- Base Stage ---
# Используем один и тот же базовый образ для всех стадий, чтобы обеспечить консистентность
FROM node:20-alpine AS base
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
# Эта стадия устанавливает все зависимости, генерирует Prisma-клиент и собирает production-билд
FROM base AS builder
WORKDIR /usr/src/app

# Копируем только файлы манифестов для кэширования зависимостей
# Это самый важный шаг для корректной работы pnpm в монорепозитории
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Копируем prisma schema до установки зависимостей, чтобы postinstall скрипт сработал
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies.
# Это запустит `prisma generate` через `postinstall` скрипт.
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код проекта
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
# Финальная, легковесная стадия, которая содержит только то, что нужно для запуска
FROM base AS runner
WORKDIR /usr/src/app

# Копируем необходимые артефакты из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
# Копируем сгенерированную схему, если она нужна в рантайме (например, для миграций)
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

ENV NODE_ENV=production

EXPOSE 3001

CMD ["pnpm", "start:backend"]
