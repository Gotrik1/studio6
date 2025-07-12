# 1. Builder stage: Устанавливаем зависимости и собираем приложение
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Устанавливаем pnpm
RUN npm install -g pnpm@9.15.9

# Добавляем путь к исполняемым файлам pnpm в PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Копируем файлы манифеста для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Генерируем Prisma-клиент
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд-приложение
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: production-образ
FROM node:20-alpine

WORKDIR /usr/src/app

# Устанавливаем pnpm (нужно для install)
RUN npm install -g pnpm@9.15.9

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Production-зависимости только для запуска
RUN pnpm install --prod --frozen-lockfile

# Копируем скомпилированный код, prisma и клиент
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

EXPOSE 3001

CMD ["node", "backend/dist/main"]
