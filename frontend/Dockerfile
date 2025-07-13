# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# --- Builder Stage ---
# Устанавливает все зависимости и собирает приложение.
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
# Копирует собранные файлы и production-зависимости.
FROM base AS runner
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

CMD ["pnpm", "start:frontend"]
