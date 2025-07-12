# 1. Builder stage: Устанавливаем зависимости и собираем приложение
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Добавляем путь к исполняемым файлам pnpm в PATH
# Это ключевой шаг, чтобы команды `prisma` и `nest` были найдены
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Копируем файлы манифеста для установки зависимостей
# Это позволяет кэшировать слой с зависимостями, если они не менялись
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies, необходимые для сборки
RUN pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Генерируем Prisma-клиент
# Теперь команда `prisma` будет найдена благодаря ENV PATH
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд-приложение
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Собираем легковесный образ для запуска
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы манифеста для установки ТОЛЬКО production-зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Устанавливаем только production-зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем скомпилированный код из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем схему Prisma для выполнения миграций в CI/CD
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Копируем сгенерированный Prisma-клиент
# Он необходим для работы приложения в рантайме
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Открываем порт, на котором будет работать приложение
EXPOSE 3001

# Команда для запуска приложения
CMD ["node", "backend/dist/main"]
