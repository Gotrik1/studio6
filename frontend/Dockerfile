# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Устанавливаем зависимости ТОЛЬКО для фронтенда
RUN pnpm install --filter prodvor-frontend --frozen-lockfile

# Копируем остальной код
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
FROM base AS runner
WORKDIR /app

COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/frontend/node_modules ./frontend/node_modules

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
