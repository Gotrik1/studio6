# Используем официальный образ Node.js v20 в качестве базового
# Это наша "строительная" стадия, где будут установлены все зависимости и произведена сборка
FROM node:20-slim AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Устанавливаем pnpm глобально, используя corepack
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

# Копируем корневые файлы конфигурации монорепозитория
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json для каждого воркспейса (backend и frontend)
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости (включая devDependencies), чтобы были доступны инструменты сборки
# --no-frozen-lockfile нужен для CI, если lock-файл мог устареть
RUN pnpm install --no-frozen-lockfile

# Копируем исходный код бэкенда и фронтенда
COPY backend ./backend
COPY frontend ./frontend

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
# Это наша "исполнительная" стадия, которая будет содержать только то, что нужно для запуска приложения
FROM node:20-slim AS runner

WORKDIR /usr/src/app

# Копируем корневые файлы конфигурации
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json для каждого воркспейса из builder-стадии
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Устанавливаем только production зависимости
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate && pnpm install --prod --no-frozen-lockfile

# Явно запускаем prisma generate, чтобы создать Prisma Client в node_modules
RUN pnpm --filter prodvor-backend exec prisma generate

# Копируем собранный код бэкенда из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем схему Prisma для runtime
COPY backend/prisma ./backend/prisma

# Указываем, что контейнер будет слушать порт 3001
EXPOSE 3001

# Команда по умолчанию для запуска приложения
CMD ["pnpm", "start:backend"]
