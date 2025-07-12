# Stage 1: Установка зависимостей
FROM node:20-alpine AS dependencies
WORKDIR /app

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------

# Stage 2: Сборка приложения
FROM dependencies AS builder
WORKDIR /app

COPY . .
RUN pnpm --filter prodvor-frontend build

# -----------------------------------------------------------------------------

# Stage 3: Финальный образ
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/frontend/.next /app/frontend/.next
COPY --from=builder /app/frontend/public /app/frontend/public
COPY --from=builder /app/frontend/package.json /app/frontend/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/frontend/node_modules /app/frontend/node_modules


EXPOSE 9002

CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
