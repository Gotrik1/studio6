# Этап 1: Сборка приложения
FROM node:20 AS builder

WORKDIR /usr/src/app

# Включаем pnpm
RUN corepack enable

# Копируем манифесты зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса для корректной установки
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости (включая devDependencies)
# Это нужно для сборки
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Подготовка production-зависимостей
FROM node:20 AS pruner

WORKDIR /usr/src/app

# Включаем pnpm
RUN corepack enable

# Копируем манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ТОЛЬКО production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --ignore-scripts

# Этап 3: Финальный образ
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Копируем production-зависимости из pruner
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/frontend/package.json ./frontend/package.json

# Копируем собранный код из builder
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Устанавливаем пользователя
USER node

# Команда для запуска приложения (используем pnpm для консистентности)
# CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
# Прямой вызов Next.js может быть надежнее в production
CMD ["node", "frontend/node_modules/next/dist/bin/next", "start", "-p", "9002"]
