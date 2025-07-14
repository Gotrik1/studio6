# --- Base Stage ---
# Используем базовый образ Node.js на Alpine для легковесности.
# Устанавливаем OpenSSL, необходимый для Prisma.
FROM node:20-alpine as base
RUN apk add --no-cache openssl

# --- Builder Stage (для сборки проекта) ---
# На этой стадии устанавливаются ВСЕ зависимости (включая devDependencies) и происходит сборка.
FROM base as builder
WORKDIR /usr/src/app

# Устанавливаем pnpm нужной версии
RUN npm install -g pnpm@10.13.1

# Копируем только файлы манифестов для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса, чтобы pnpm понял, что устанавливать
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma ДО установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости. pnpm автоматически вызовет 'postinstall' скрипт,
# который в свою очередь выполнит 'prisma generate'.
RUN pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build


# --- Pruner Stage (для production-зависимостей) ---
# Эта стадия нужна для того, чтобы создать легковесную node_modules только с production-зависимостями.
FROM base as pruner
WORKDIR /app

RUN npm install -g pnpm@10.13.1

# Копируем скомпилированный бэкенд и его package.json из builder-стадии
COPY --from=builder /usr/src/app/backend /app/backend
COPY --from=builder /usr/src/app/package.json /app/
COPY --from=builder /usr/src/app/pnpm-lock.yaml /app/
# КРИТИЧЕСКИ ВАЖНО: копируем pnpm-workspace.yaml, чтобы deploy работал
COPY --from=builder /usr/src/app/pnpm-workspace.yaml /app/

# Устанавливаем ТОЛЬКО production-зависимости для бэкенда
RUN pnpm --filter prodvor-backend deploy --prod ./backend


# --- Runner Stage (финальный образ для production) ---
# Это финальный, легковесный образ, который будет запускаться в production.
FROM base AS runner
WORKDIR /app

# Копируем скомпилированный код из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./dist

# Копируем production-версию node_modules из pruner-стадии
COPY --from=pruner /app/backend/node_modules ./node_modules
COPY --from=pruner /app/backend/package.json ./package.json

# Команда для запуска приложения
CMD ["node", "dist/main.js"]


# --- Migrations Stage (для CI/CD) ---
# Эта стадия содержит все зависимости (включая dev), необходимые для запуска миграций.
FROM builder AS migrations
# Команда для запуска миграций в CI
CMD ["pnpm", "prisma:migrate:deploy"]
