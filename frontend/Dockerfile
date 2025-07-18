# Этап 1: Базовый образ для сборки с полным набором инструментов
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable

# Этап 2: Сборщик - установка всех зависимостей и сборка проекта
FROM base AS builder
WORKDIR /usr/src/app

# Копируем только манифесты для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma до установки
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем приложение
RUN pnpm --filter prodvor-frontend build

# Этап 3: Pruner - установка только production-зависимостей
FROM base AS pruner
WORKDIR /usr/src/app

# Копируем только манифесты и скомпилированный код
COPY --from=builder /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.cjs ./frontend/next.config.cjs

# Устанавливаем только production зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-frontend ./

# Этап 4: Runner - финальный легковесный образ
FROM node:20-alpine AS runner
WORKDIR /app

# Копируем результат работы pruner
COPY --from=pruner /usr/src/app/frontend ./frontend
COPY --from=pruner /usr/src/app/node_modules ./node_modules

# Указываем команду для запуска
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
