# --- Base Stage ---
FROM node:20-alpine AS base
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем корневые манифесты и tsconfig
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json .npmrc* ./

# Устанавливаем ВСЕ зависимости (включая dev) для всех воркспейсов
RUN pnpm install --no-frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
FROM base as runner
WORKDIR /app

# Копируем только необходимые артефакты из builder
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/frontend/node_modules ./frontend/node_modules

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
