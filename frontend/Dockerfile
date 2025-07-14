# --- Base Stage ---
# Устанавливаем базовый образ и pnpm
FROM node:20-alpine as base
RUN npm install -g pnpm@10.13.1

# --- Dependencies Stage ---
# Устанавливаем ВСЕ зависимости, включая dev, для сборки
FROM base as builder
WORKDIR /usr/src/app
# Копируем все манифесты, чтобы pnpm понял структуру воркспейса
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Устанавливаем все зависимости.
RUN pnpm install --frozen-lockfile
# Копируем весь остальной код
COPY . .
# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Pruner Stage ---
# Создаем чистую директорию с production-зависимостями
FROM base as pruner
WORKDIR /app
COPY --from=builder /usr/src/app/frontend /app/frontend
COPY --from=builder /usr/src/app/package.json /app/
COPY --from=builder /usr/src/app/pnpm-lock.yaml /app/
# ВАЖНО: Копируем workspace.yaml, чтобы pnpm deploy работал
COPY --from=builder /usr/src/app/pnpm-workspace.yaml /app/
RUN pnpm deploy --prod frontend

# --- Runner Stage (финальный образ для production) ---
FROM base AS runner
WORKDIR /app
COPY --from=pruner /app/frontend /app/frontend
# Копируем package.json, чтобы команда 'start' работала
COPY --from=pruner /app/package.json /app/
# Копируем публичные ассеты и standalone-файлы Next.js
COPY --from=builder /usr/src/app/frontend/public /app/frontend/public
COPY --from=builder /usr/src/app/frontend/.next/standalone /app/
COPY --from=builder /usr/src/app/frontend/.next/static /app/frontend/.next/static

ENV NODE_ENV=production
# Запускаем приложение
CMD ["pnpm", "start:frontend"]
