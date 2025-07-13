# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# --- Builder Stage ---
# Устанавливает все зависимости, включая devDependencies,
# генерирует Prisma-клиент и собирает приложение.
FROM base AS builder
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY prisma ./prisma/
RUN pnpm install --no-frozen-lockfile
COPY . .
# Генерируем Prisma-клиент перед сборкой
RUN pnpm --filter prodvor-backend prisma:generate
# Собираем только backend
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
# Устанавливает только production зависимости и копирует
# собранные файлы из builder-стадии.
FROM base AS runner
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY prisma ./prisma/
# Копируем production-зависимости, сгенерированный клиент и собранное приложение из builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

CMD ["pnpm", "start:backend"]
