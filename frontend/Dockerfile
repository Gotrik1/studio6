#
# Этап 1: Сборщик (Builder)
#
FROM node:20 AS builder

WORKDIR /app

# Глобально устанавливаем pnpm для надежности
RUN npm install -g pnpm@10.13.1

# Копируем файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости. 
# Используем --no-frozen-lockfile, чтобы pnpm мог обновить lock-файл, если он не соответствует package.json.
RUN pnpm install --no-frozen-lockfile

# Копируем весь исходный код проекта
COPY . .

# Собираем frontend приложение
RUN pnpm --filter prodvor-frontend build

#
# Этап 2: Запуск (Runner)
#
FROM node:20-slim

WORKDIR /app

# Копируем файлы манифеста из builder-стадии (включая обновленный pnpm-lock.yaml)
COPY --from=builder /app/package.json \
                    /app/pnpm-lock.yaml \
                    /app/pnpm-workspace.yaml \
                    ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/frontend/package.json ./frontend/

# Устанавливаем только production зависимости
RUN npm install -g pnpm@10.13.1 && \
    pnpm install --prod --frozen-lockfile

# Копируем собранное Next.js приложение
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/next.config.mjs ./frontend/

# Указываем команду для запуска
CMD ["pnpm", "start:frontend"]
