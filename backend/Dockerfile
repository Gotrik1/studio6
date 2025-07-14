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

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build

# --- Pruner Stage (для production-зависимостей) ---
# На этой стадии мы создаем "чистую" папку node_modules только с production-зависимостями
FROM base as pruner
WORKDIR /app

COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

RUN pnpm deploy --prod ./backend

# --- Runner Stage (финальный образ для production) ---
# Самый легковесный образ, содержащий только необходимое для запуска
FROM node:20-alpine AS runner
WORKDIR /app

# Устанавливаем переменные окружения для production
ENV NODE_ENV=production

# Копируем скомпилированный код и production-зависимости
COPY --from=pruner /app/backend/dist ./backend/dist
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=pruner /app/backend/package.json ./backend/package.json

# Запускаем приложение
CMD ["node", "backend/dist/main.js"]


# --- Migrations Stage ---
# Отдельная стадия для выполнения миграций в CI/CD
# Она основана на builder, так как содержит все dev-зависимости (включая Prisma CLI)
FROM builder AS migrations
WORKDIR /usr/src/app

CMD ["pnpm", "prisma:migrate:deploy"]
