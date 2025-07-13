# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем все файлы-манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
FROM base AS runner
WORKDIR /app

# Копируем только необходимые артефакты из builder
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

EXPOSE 9002
CMD [ "pnpm", "start:frontend" ]
