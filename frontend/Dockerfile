# Этап 1: Установка зависимостей и сборка проекта
FROM node:20 AS builder

WORKDIR /usr/src/app

# Включаем corepack для управления pnpm
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma/schema.prisma ./backend/prisma/

# Устанавливаем ВСЕ зависимости (включая dev), чтобы prisma client был доступен для typecheck
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной код проекта ПОСЛЕ установки зависимостей
COPY . .

# Собираем только фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Подготовка production-версии node_modules
FROM node:20 AS pruner

WORKDIR /usr/src/app

# Включаем corepack для управления pnpm
RUN corepack enable

COPY pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/.next/standalone ./frontend/
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Устанавливаем только production-зависимости для фронтенда
RUN pnpm deploy --prod --filter prodvor-frontend ./frontend

# Этап 3: Финальный легковесный образ
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Копируем только скомпилированный проект и production-зависимости
COPY --from=pruner /usr/src/app/frontend .

EXPOSE 9002

CMD ["node", "server.js"]
