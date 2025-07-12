# Этап 1: Установка зависимостей с использованием pnpm
FROM node:20-alpine AS dependencies

WORKDIR /usr/src/app

# Копируем файлы package.json и pnpm-lock.yaml из корня и из каждого воркспейса
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости монорепозитория
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Этап 2: Сборка бэкенда
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Копируем все зависимости, установленные на предыдущем этапе
COPY --from=dependencies /usr/src/app/ .

# Копируем исходный код бэкенда и Prisma схему
COPY backend/ ./backend/
COPY backend/prisma/ ./prisma/
COPY tsconfig.json .

# Запускаем генерацию Prisma клиента и сборку NestJS приложения
RUN pnpm --filter prodvor-backend prisma:generate
RUN pnpm --filter prodvor-backend build

# Этап 3: Создание легковесного финального образа
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Копируем только необходимые для запуска артефакты из образа builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/package.json .

# Копируем схему Prisma, она нужна для запуска
COPY --from=builder /usr/src/app/prisma ./prisma/

EXPOSE 3001

# Команда для запуска приложения
# Заметьте, что мы используем pnpm для запуска, а не npm
CMD ["pnpm", "start:backend"]
