# --- Base Stage ---
FROM node:20-alpine as base
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base as builder
WORKDIR /usr/src/app

# Копируем манифесты зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.json ./
# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Копируем Prisma схему до установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies
# Это необходимо для доступа к CLI `prisma` и `nest`
# `postinstall` скрипт автоматически вызовет `prisma generate`
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только backend
RUN pnpm --filter prodvor-backend build

# --- Pruner Stage (для production-зависимостей) ---
FROM base as pruner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ .
RUN pnpm --filter prodvor-backend deploy --prod /prod/backend

# --- Runner Stage (финальный, легкий образ) ---
FROM base as runner
WORKDIR /usr/src/app

COPY --from=pruner /prod/backend/dist ./backend/dist
COPY --from=pruner /prod/backend/node_modules ./backend/node_modules
COPY --from=pruner /prod/backend/package.json ./backend/package.json

WORKDIR /usr/src/app/backend
EXPOSE 3001
CMD ["node", "dist/main"]
