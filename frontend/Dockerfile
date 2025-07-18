# Этап 1: Сборка проекта
FROM node:20 as builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/

# Устанавливаем зависимости (включая devDependencies для сборки)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Оптимизация node_modules для продакшена
FROM node:20 as pruner

WORKDIR /usr/src/app

# Включаем corepack
RUN corepack enable

# Копируем только необходимые для деплоя файлы из сборщика
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Устанавливаем только production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter prodvor-frontend deploy --prod ./frontend

# Этап 3: Финальный образ
FROM node:20-alpine as runner

WORKDIR /app

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Копируем оптимизированные node_modules и собранный проект из pruner
COPY --from=pruner /usr/src/app/frontend/node_modules ./node_modules
COPY --from=pruner /usr/src/app/frontend/.next ./.next
COPY --from=pruner /usr/src/app/frontend/public ./public
COPY --from=pruner /usr/src/app/frontend/package.json ./

# Указываем команду для запуска приложения
CMD ["pnpm", "start"]
