# Этап 1: Сборка проекта
FROM node:20 as builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Включаем corepack для управления pnpm
RUN corepack enable

# Копируем корневые файлы манифеста
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса, чтобы pnpm понял структуру
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma (хотя она и не нужна для фронтенда, делаем для консистентности)
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies, чтобы сработали все скрипты
# (включая prisma generate для backend)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем ВЕСЬ остальной код
COPY . .

# Собираем конкретный воркспейс (frontend)
RUN pnpm --filter prodvor-frontend build

# Этап 2: Подготовка production-зависимостей
FROM node:20 as pruner

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Включаем corepack
RUN corepack enable

# Копируем pnpm-workspace.yaml, чтобы deploy знал о структуре
COPY pnpm-workspace.yaml ./

# Копируем собранный проект и его package.json
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Устанавливаем ТОЛЬКО production-зависимости для фронтенда
RUN pnpm deploy --prod --filter prodvor-frontend /prod

# Этап 3: Финальный образ
FROM node:20-alpine as runner

# Устанавливаем рабочую директорию
WORKDIR /app/frontend

# Копируем production-зависимости и собранный проект
COPY --from=pruner /prod/node_modules ./node_modules
COPY --from=pruner /prod/frontend/.next ./.next
COPY --from=pruner /prod/frontend/public ./public
COPY --from=pruner /prod/frontend/package.json .

# Запускаем приложение
CMD ["pnpm", "start"]
