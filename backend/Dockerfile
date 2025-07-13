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

# Копируем схему Prisma до установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies, чтобы были доступны CLI
# Команда postinstall в backend/package.json автоматически вызовет 'prisma generate'
RUN pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
FROM base AS runner
WORKDIR /usr/src/app

# Копируем только необходимые артефакты из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

EXPOSE 3001

# Команда для запуска production-сервера
CMD ["node", "backend/dist/main.js"]
