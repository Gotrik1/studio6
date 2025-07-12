# 1. Builder stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@9.15.9

# Копируем файлы манифеста для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/ 

# Устанавливаем все зависимости (dev и prod)
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код
COPY . .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# 2. Runner stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Устанавливаем pnpm глобально (для запуска)
RUN npm install -g pnpm@9.15.9

# Копируем package.json и lock файлы, чтобы корректно ставились prod-зависимости
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/

# Устанавливаем только production-зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем собранный фронтенд
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.js ./frontend/next.config.js
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json

# Открываем порт для Next.js
EXPOSE 9002

# Запуск сервера Next.js
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
