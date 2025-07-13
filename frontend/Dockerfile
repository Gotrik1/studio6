# --- Base Stage ---
FROM node:20-alpine AS base
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем все манифесты и ключевые конфиги
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json .npmrc* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies, чтобы были доступны CLI
RUN pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Собираем только frontend, так как это Dockerfile для фронтенда
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
FROM base as runner
WORKDIR /app

# Копируем только необходимые артефакты из builder-стадии
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/.next/standalone ./frontend
COPY --from=builder /usr/src/app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json

EXPOSE 9002

ENV PORT 9002
ENV HOSTNAME "0.0.0.0"

# Команда для запуска production-сервера
CMD ["node", "frontend/server.js"]
