
# --- Builder Stage ---
# This stage installs all dependencies (including dev) and builds the application.
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем корневые файлы для pnpm workspace
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Копируем package.json для каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies, для сборки
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --no-frozen-lockfile

# Копируем весь исходный код фронтенда
COPY ./frontend ./frontend

# Собираем только frontend, так как это Dockerfile для фронтенда
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
# This stage creates the final, optimized image for production.
FROM node:20-alpine AS runner

WORKDIR /app

# Устанавливаем только production зависимости
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/backend/package.json ./backend/
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --prod --frozen-lockfile

# Копируем скомпилированный код фронтенда из builder-стадии
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package.json ./frontend/package.json

EXPOSE 9002

CMD ["pnpm", "start:frontend"]
