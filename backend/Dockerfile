# --- Builder Stage ---
FROM node:20-alpine AS builder

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@10.13.1

# Устанавливаем рабочую директорию в корень проекта
WORKDIR /usr/src/app

# Копируем файлы манифеста для кэширования зависимостей
# Копируем .npmrc*, чтобы pnpm мог его использовать, если он существует
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json .npmrc* ./

# Копируем схему Prisma до установки зависимостей, чтобы postinstall скрипт сработал корректно
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies, чтобы были доступны CLI (prisma, nest)
# Этот слой будет кэшироваться, если файлы манифеста не изменились
RUN pnpm install

# Копируем весь остальной исходный код
COPY . .

# Собираем только backend, так как это Dockerfile для бэкенда
# Prisma generate вызывается автоматически через postinstall скрипт в package.json
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
FROM node:20-alpine as runner

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json бэкенда для запуска
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# Копируем только production-зависимости из builder-стадии
# pnpm сам правильно скопирует нужные пакеты из node_modules
# Prisma Client уже будет сгенерирован
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Копируем скомпилированный код
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Указываем команду для запуска приложения
# WORKDIR уже установлен, поэтому можно использовать относительный путь
CMD ["node", "backend/dist/main"]
