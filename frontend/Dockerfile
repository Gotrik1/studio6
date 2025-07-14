# --- Base Stage (для общих зависимостей) ---
FROM node:20-alpine as base
RUN apk add --no-cache openssl
WORKDIR /app
RUN npm install -g pnpm@10.13.1

# --- Builder Stage (для сборки приложения) ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем ВСЕ манифесты, чтобы pnpm видел всю структуру воркспейса
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, так как она нужна для postinstall
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Pruner Stage (для production-зависимостей) ---
FROM base AS pruner
WORKDIR /app

# Копируем собранный проект из builder
COPY --from=builder /usr/src/app/frontend /app/frontend
COPY --from=builder /usr/src/app/package.json /app/
COPY --from=builder /usr/src/app/pnpm-lock.yaml /app/
COPY --from=builder /usr/src/app/pnpm-workspace.yaml /app/

# Устанавливаем ТОЛЬКО production-зависимости для фронтенда
RUN pnpm deploy --prod --filter prodvor-frontend

# --- Runner Stage (финальный образ для production) ---
FROM base AS runner
WORKDIR /app

# Копируем только необходимые для запуска артефакты
COPY --from=pruner /app/frontend /app/frontend
COPY --from=pruner /app/node_modules /app/node_modules

# Устанавливаем NEXT_TELEMETRY=0 для отключения сбора телеметрии Next.js
ENV NEXT_TELEMETRY=0
