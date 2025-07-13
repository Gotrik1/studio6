# --- Base Stage ---
# Используем базовый образ Node.js
FROM node:20-alpine as base

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
# На этой стадии мы устанавливаем все зависимости (включая dev) и собираем проект.
FROM base AS builder

# Устанавливаем рабочую директорию в корень проекта
WORKDIR /usr/src/app

# Копируем файлы манифеста, чтобы кэшировать слой с зависимостями
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./

# Копируем package.json каждого воркспейса, чтобы pnpm понял, что их нужно установить
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости (включая devDependencies) для всех воркспейсов.
RUN pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Собираем только frontend, так как это Dockerfile для фронтенда
RUN pnpm --filter prodvor-frontend build

# --- Pruner Stage ---
# На этой стадии мы удаляем devDependencies, чтобы финальный образ был меньше.
FROM base AS pruner

WORKDIR /usr/src/app

# Копируем все из builder
COPY --from=builder /usr/src/app/ ./

# Удаляем все devDependencies, оставляя только production-зависимости
RUN pnpm prune --prod


# --- Runner Stage ---
# Финальный, легковесный образ для запуска приложения.
FROM base as runner

WORKDIR /app

ENV NODE_ENV=production

# Копируем только production-зависимости из pruner
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/frontend/node_modules ./frontend/node_modules
COPY --from=pruner /usr/src/app/package.json .
COPY --from=pruner /usr/src/app/frontend/package.json ./frontend/

# Копируем собранное приложение из builder
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Устанавливаем пользователя без root прав для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 9002

CMD ["pnpm", "start:frontend"]
