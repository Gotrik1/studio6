# 1. Этап "builder": Сборка приложения
FROM node:20 as builder
WORKDIR /usr/src/app

# Активируем pnpm
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

# Собираем только фронтенд
RUN pnpm --filter prodvor-frontend build


# 2. Этап "pruner": Установка только production-зависимостей
FROM node:20 as pruner
WORKDIR /prod
RUN corepack enable

# Копируем только нужные манифесты в пустую директорию
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/package.json ./

# Устанавливаем только production-зависимости для фронтенда в текущую директорию (/prod)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-frontend ./

# Копируем скомпилированный код
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json


# 3. Этап "runner": Финальный легковесный образ
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Копируем production-зависимости и скомпилированный код из "pruner"
COPY --from=pruner /prod .

# Указываем команду для запуска приложения
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
