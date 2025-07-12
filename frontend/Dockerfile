# -----------------------------------------------------------------------------
# Этап 1: Установка всех зависимостей, включая devDependencies
# -----------------------------------------------------------------------------
FROM node:20-alpine as dependencies

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Копируем корневой package.json и lock-файл
COPY package.json pnpm-lock.yaml ./
# Копируем package.json фронтенда
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Этап 2: Сборка приложения
# -----------------------------------------------------------------------------
FROM dependencies as builder

# Копируем исходный код фронтенда и остальные необходимые файлы из корня
COPY . .

# Собираем приложение
RUN pnpm --filter prodvor-frontend build

# -----------------------------------------------------------------------------
# Этап 3: Создание чистового образа для продакшена
# -----------------------------------------------------------------------------
from node:20-alpine as runner

WORKDIR /app

# Копируем корневой package.json и lock-файл
COPY package.json pnpm-lock.yaml ./
# Копируем package.json фронтенда
COPY frontend/package.json ./frontend/

# Устанавливаем ТОЛЬКО production-зависимости
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile

# Копируем собранное приложение из этапа сборки
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.ts ./frontend/

# Копируем статические ассеты, если они есть
COPY --from=builder /usr/src/app/frontend/src/shared/assets ./frontend/src/shared/assets

# Добавляем пользователя без привилегий
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 9002

ENV NODE_ENV=production

# CMD для запуска берем из package.json фронтенда
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
