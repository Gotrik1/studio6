# ---- Base Stage ----
# Используем полный образ Node.js для доступа ко всем необходимым инструментам сборки
FROM node:20 as base

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# ---- Builder Stage ----
# На этом этапе мы устанавливаем все зависимости и компилируем проект
FROM base as builder

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma до установки зависимостей
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies, для всех воркспейсов
# На этом этапе автоматически выполнится `prisma generate`
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Компилируем только бэкенд
RUN pnpm --filter prodvor-backend build

# ---- Pruner Stage ----
# Этот этап нужен для того, чтобы в финальном образе были только production-зависимости
FROM base as pruner
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# Устанавливаем только production-зависимости для бэкенда
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --filter prodvor-backend

# ---- Runner Stage (Final Image) ----
# Собираем финальный, легковесный образ для запуска
FROM base as runner

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем скомпилированный код и production-версию node_modules
COPY --from=pruner /usr/src/app/backend/package.json ./backend/package.json
COPY --from=pruner /usr/src/app/backend/dist ./backend/dist
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/node_modules ./backend/node_modules

# Открываем порт
EXPOSE 3001

# Команда для запуска приложения
CMD ["node", "backend/dist/main"]
