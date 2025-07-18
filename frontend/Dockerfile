# Этап 1: Установка зависимостей и сборка проекта
FROM node:20 as builder

WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем корневые манифесты
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем манифесты КАЖДОГО воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, так как она может быть нужна для типов
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем ВЕСЬ остальной код
COPY . .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Подготовка production-версии node_modules
FROM node:20 as pruner

WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем только то, что нужно для production-установки
COPY pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Устанавливаем только production-зависимости для фронтенда
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --filter prodvor-frontend

# Этап 3: Финальный легковесный образ
FROM node:20-alpine as runner

WORKDIR /app

# Копируем скомпилированный код и production-зависимости
COPY --from=pruner /usr/src/app/frontend/.next ./frontend/.next
COPY --from=pruner /usr/src/app/frontend/public ./frontend/public
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/frontend/package.json ./frontend/package.json

# Указываем пользователя для безопасности
USER node

# Команда для запуска приложения
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
