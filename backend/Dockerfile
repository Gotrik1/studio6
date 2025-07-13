# --- Base Stage ---
FROM node:20-alpine as base
WORKDIR /app
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Копируем схему Prisma ДО установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем зависимости ТОЛЬКО для бэкенда
RUN pnpm install --filter prodvor-backend --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Явно генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем только backend
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
FROM base as runner
WORKDIR /usr/src/app

# Копируем только необходимые для запуска артефакты
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Копируем только production-зависимости, установленные на предыдущем шаге
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma


EXPOSE 3001
CMD ["node", "backend/dist/main"]
