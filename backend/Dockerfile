#
# Этап 1: Сборщик (Builder)
#
FROM node:20 AS builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Глобально устанавливаем pnpm для надежности
RUN npm install -g pnpm@9.15.9

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

# Копируем файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies. 
# Используем --no-frozen-lockfile, чтобы pnpm мог обновить lock-файл, если он не соответствует package.json.
RUN pnpm install --no-frozen-lockfile

# Копируем весь исходный код проекта
COPY . .

# Генерируем Prisma Client, чтобы он был доступен во время сборки
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем backend приложение
RUN pnpm --filter prodvor-backend build

#
# Этап 2: Запуск (Runner)
#
FROM node:20-slim

WORKDIR /usr/src/app

# Копируем файлы манифеста из builder-стадии (включая обновленный pnpm-lock.yaml)
COPY --from=builder /usr/src/app/package.json \
                    /usr/src/app/pnpm-lock.yaml \
                    /usr/src/app/pnpm-workspace.yaml \
                    ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Устанавливаем только production зависимости, используя уже обновленный lock-файл
# Это делает финальный образ легковесным
RUN npm install -g pnpm@9.15.9 && \
    pnpm install --prod --frozen-lockfile

# Копируем схему Prisma для runtime
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Копируем собранное приложение из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Указываем команду для запуска приложения
CMD ["pnpm", "start:backend"]
