FROM node:20-slim AS base

# 1. Установка зависимостей
FROM base AS deps
WORKDIR /usr/src/app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install

# 2. Сборка приложения
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN pnpm --filter prodvor-backend build

# 3. Финальный образ
FROM base AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3001
CMD ["npm", "run", "start:prod", "--workspace=prodvor-backend"]
