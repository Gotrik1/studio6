# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base AS builder

# Копируем все файлы-манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma ДО установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости. `prisma generate` запустится через postinstall
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
FROM base AS runner
WORKDIR /usr/src/app

# Копируем только необходимые артефакты из builder
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

EXPOSE 3001
CMD [ "pnpm", "start:backend" ]
