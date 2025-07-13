# 1. Builder stage: Build the application
FROM node:20 AS builder

WORKDIR /usr/src/app

# --- DEBUGGING PRISMA ---
# Устанавливаем openssl, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# Включаем corepack для управления pnpm
# RUN corepack enable

# Явно устанавливаем pnpm глобально, чтобы избежать проблем с corepack в Docker
RUN npm install -g pnpm@9.15.9

# Копируем файлы манифеста для установки зависимостей
# Это позволяет Docker кэшировать зависимости, если файлы не менялись
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код проекта
COPY . .

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд приложение
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Create a slim image for production
FROM node:20-slim AS runner

WORKDIR /usr/src/app

# Снова устанавливаем openssl, так как это новая стадия
RUN apt-get update && apt-get install -y openssl

# Копируем только необходимые для запуска production-зависимости из builder-стадии
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/package.json ./

# Устанавливаем ТОЛЬКО production-зависимости
# Это делает финальный образ значительно меньше
RUN npm install -g pnpm@9.15.9
RUN pnpm install --prod --frozen-lockfile

# Копируем собранное приложение из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Указываем команду для запуска приложения
CMD ["node", "backend/dist/main"]
