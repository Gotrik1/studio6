FROM node:20-alpine as base
RUN apk add --no-cache openssl && npm install -g pnpm@10.13.1


# --- Builder Stage (для сборки и установки всех зависимостей) ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем только манифесты для эффективного кэширования Docker-слоев
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Prisma-схема нужна, так как pnpm install запускает postinstall для всех воркспейсов
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Pruner Stage (для production-зависимостей) ---
FROM base AS pruner
WORKDIR /app
COPY --from=builder /usr/src/app/frontend /app/frontend
COPY --from=builder /usr/src/app/package.json /app/package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=builder /usr/src/app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
# Устанавливаем ТОЛЬКО production-зависимости для фронтенда
RUN pnpm install --prod --filter prodvor-frontend

# --- Runner Stage (финальный образ для production) ---
FROM base AS runner
WORKDIR /app
COPY --from=pruner /app/frontend /app/frontend
COPY --from=pruner /app/node_modules /app/node_modules
COPY --from=pruner /app/package.json /app/package.json

# Устанавливаем рабочую директорию внутри воркспейса фронтенда
WORKDIR /app/frontend
CMD ["pnpm", "start"]
