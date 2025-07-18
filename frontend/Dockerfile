# Этап 1: Базовый образ
FROM node:20 as base
WORKDIR /usr/src/app

# Этап 2: Установка зависимостей и сборка
FROM base as builder
# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости (включая dev)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем весь остальной код проекта
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# Этап 3: Подготовка production-зависимостей
FROM base as pruner
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --filter prodvor-frontend

# Этап 4: Финальный образ
FROM node:20-alpine as runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=pruner /usr/src/app/frontend/public ./public
COPY --from=pruner /usr/src/app/frontend/.next/standalone ./
COPY --from=pruner /usr/src/app/frontend/.next/static ./.next/static
COPY --from=pruner /usr/src/app/node_modules ./node_modules

EXPOSE 9002
CMD ["node", "server.js"]
