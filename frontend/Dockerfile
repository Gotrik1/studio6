# Этап 1: Установка зависимостей и сборка проекта
FROM node:20 as builder
WORKDIR /usr/src/app

# Включаем pnpm через corepack
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса для корректной установки
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, т.к. она может быть нужна для типов, даже если фронтенд не использует сам клиент
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости. Это сгенерирует Prisma Client, типы которого могут быть полезны
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной код проекта ПОСЛЕ установки зависимостей
COPY . .

# Собираем только фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Оптимизация node_modules для production
FROM node:20 as pruner
WORKDIR /usr/src/app

# Включаем pnpm через corepack
RUN corepack enable

# Копируем только необходимые для деплоя манифесты
COPY pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Копируем только скомпилированный фронтенд
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Устанавливаем ТОЛЬКО production-зависимости для фронтенда
RUN pnpm deploy --legacy --prod --filter prodvor-frontend ./

# Этап 3: Финальный легковесный образ
FROM node:20-alpine as runner
WORKDIR /app

# Копируем production-версию node_modules, скомпилированный проект и публичные файлы
COPY --from=pruner /usr/src/app .

# Копируем package.json фронтенда, чтобы Next.js мог его найти
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Запускаем приложение
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
