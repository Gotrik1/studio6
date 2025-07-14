# --- Base Stage ---
# Общая база для всех последующих стадий
FROM node:20-alpine AS base
RUN apk add --no-cache openssl

# --- Builder Stage (для сборки проекта) ---
# На этой стадии мы устанавливаем ВСЕ зависимости (включая dev) и компилируем код
FROM base as builder
WORKDIR /usr/src/app

# Копируем только файлы-манифесты для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# ВАЖНО: Копируем package.json КАЖДОГО воркспейса, чтобы pnpm понял, что нужно ставить
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma ДО установки зависимостей, т.к. postinstall ее использует
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости. На этом шаге сработает postinstall и prisma generate
RUN pnpm install --frozen-lockfile

# Копируем ВЕСЬ остальной код проекта
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage (финальный образ для production) ---
# Самый легковесный образ, содержащий только необходимое для запуска
FROM base AS runner
WORKDIR /app

# Устанавливаем переменные окружения для production
ENV NODE_ENV=production

# Копируем package.json самого воркспейса для корректного запуска
COPY --from=builder /usr/src/app/frontend/package.json .
COPY --from=builder /usr/src/app/frontend/.next ./.next
COPY --from=builder /usr/src/app/frontend/public ./public
# Копируем node_modules, которые нужны для работы Next.js сервера
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Запускаем приложение
CMD ["pnpm", "start"]
