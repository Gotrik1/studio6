# --- Base Stage (для общих зависимостей) ---
FROM node:20-alpine as base
WORKDIR /app
# Устанавливаем OpenSSL, необходимый для Prisma
RUN apk add --no-cache openssl
# Устанавливаем pnpm глобально, чтобы он был доступен во всех последующих стадиях
RUN npm install -g pnpm@10.13.1

# --- Builder Stage (для сборки приложения с dev-зависимостями) ---
FROM base AS builder
WORKDIR /usr/src/app

# Копируем все манифесты, чтобы pnpm мог понять структуру воркспейса
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Копируем схему Prisma ДО установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости (включая dev), что также запустит 'prisma generate'
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только backend
RUN pnpm --filter prodvor-backend build

# --- Pruner Stage (для production-зависимостей) ---
FROM base AS pruner
WORKDIR /app

# Копируем артефакты сборки и манифесты
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./

# Устанавливаем ТОЛЬКО production-зависимости для бэкенда
RUN pnpm install --prod --filter prodvor-backend

# --- Runner Stage (финальный образ для production) ---
FROM base AS runner
WORKDIR /app

# Копируем скомпилированный код и production-зависимости
COPY --from=pruner /app/backend /app/backend
COPY --from=pruner /app/node_modules /app/node_modules

# Устанавливаем рабочую директорию на бэкенд
WORKDIR /app/backend

# Открываем порт и задаем команду запуска
EXPOSE 3001
CMD ["node", "dist/main.js"]


# --- Migrations Stage (отдельный образ для миграций с dev-зависимостями) ---
FROM builder as migrations
# Эта стадия наследует все из builder, включая dev-зависимости (как prisma)
# Команда запускается из docker-compose.ci.yml
CMD ["pnpm", "prisma:migrate:deploy"]
