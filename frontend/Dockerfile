# --- Base Stage ---
FROM node:20-alpine as base
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем манифесты зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Pruner Stage (для production-зависимостей) ---
FROM base AS pruner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ .
RUN pnpm --filter prodvor-frontend deploy --prod /prod/frontend

# --- Runner Stage ---
FROM base AS runner
WORKDIR /usr/src/app

COPY --from=pruner /prod/frontend/.next/standalone ./
COPY --from=pruner /prod/frontend/.next/static ./frontend/.next/static
COPY --from=pruner /prod/frontend/public ./frontend/public

WORKDIR /usr/src/app/frontend
EXPOSE 9002
CMD ["node", "server.js"]
