# 1. Этап "builder": Сборка приложения и генерация Prisma
FROM node:20 as builder
WORKDIR /usr/src/app

# Активируем pnpm
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies, чтобы запустить скрипты
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

# Собираем только бэкенд
RUN pnpm --filter prodvor-backend build


# 2. Этап "pruner": Установка только production-зависимостей
FROM node:20 as pruner
WORKDIR /prod
RUN corepack enable

# Копируем только нужные манифесты в пустую директорию
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/package.json ./

# Устанавливаем только production-зависимости для бэкенда в текущую директорию (/prod)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-backend ./

# Копируем скомпилированный код
COPY --from=builder /usr/src/app/backend/dist ./backend/dist


# 3. Этап "runner": Финальный легковесный образ
FROM node:20-alpine
WORKDIR /app

# Копируем production-зависимости и скомпилированный код из "pruner"
COPY --from=pruner /prod .

# Указываем команду для запуска приложения
CMD ["node", "backend/dist/main.js"]
