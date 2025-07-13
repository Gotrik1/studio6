# --- Base Stage ---
# Используем Alpine для легковесности
FROM node:20-alpine as base
WORKDIR /app
# Устанавливаем OpenSSL, необходимый для Prisma
RUN apk add --no-cache openssl
# Устанавливаем pnpm глобально
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
# На этой стадии мы установим все зависимости и соберем проект
FROM base as builder
WORKDIR /usr/src/app

# Копируем файлы-манифесты для всех воркспейсов, чтобы pnpm мог их увидеть
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY tsconfig.json .npmrc* ./

# Копируем схему Prisma до установки зависимостей
# Это критично, так как 'prisma generate' вызывается в postinstall
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости. pnpm автоматически определит воркспейсы
# и выполнит postinstall скрипт для prisma generate.
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
# Финальный, легковесный образ для запуска приложения
FROM base as runner
WORKDIR /app

# Копируем только необходимые для запуска артефакты из builder
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# Указываем команду для запуска скомпилированного приложения
CMD ["node", "backend/dist/main"]
