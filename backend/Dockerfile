# === Этап 1: Builder - сборка приложения и генерация Prisma Client ===
FROM node:20 AS builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем только манифесты для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, так как она нужна для генерации клиента ДО установки
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies (нужны для `prisma` CLI и `nest`)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Копируем остальной код проекта
COPY . .

# Генерируем Prisma Client. Теперь prisma CLI точно доступен.
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем production-билд
RUN pnpm --filter prodvor-backend build


# === Этап 2: Pruner - установка только production-зависимостей ===
FROM node:20 as pruner

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем только манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем скомпилированный код из 'builder'
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client

# Устанавливаем ТОЛЬКО production-зависимости. Флаг --ignore-scripts важен!
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --prod --frozen-lockfile --ignore-scripts

# === Этап 3: Runner - финальный легковесный образ для запуска ===
FROM node:20-alpine as runner

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем все production-артефакты из 'pruner'
COPY --from=pruner /usr/src/app .

# Устанавливаем команду для запуска приложения
CMD ["node", "backend/dist/main.js"]
