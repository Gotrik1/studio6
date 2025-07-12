# -----------------------------------------------------------------------------
# Этап 1: Установка базовых зависимостей
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# -----------------------------------------------------------------------------
# Этап 2: Установка зависимостей
# -----------------------------------------------------------------------------
FROM base AS dependencies
# Копируем корневые package.json и lock-файл
COPY package.json package-lock.json ./
# Копируем package.json бэкенда
COPY package.json ./backend/
# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN npm install --workspace=prodvor-backend

# -----------------------------------------------------------------------------
# Этап 3: Сборка приложения
# -----------------------------------------------------------------------------
FROM dependencies AS builder
# Копируем весь исходный код
COPY . .
# Генерируем Prisma Client
RUN npm run prisma:generate --workspace=prodvor-backend
# Собираем приложение
RUN npm run build --workspace=prodvor-backend

# -----------------------------------------------------------------------------
# Этап 4: Финальный образ для запуска
# -----------------------------------------------------------------------------
from base AS runner
# Добавляем бинарники node_modules в PATH для доступа к `nest` CLI
ENV PATH /usr/src/app/node_modules/.bin:$PATH
# Копируем собранные файлы и зависимости
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/backend/.env ./backend/

# Открываем порт, на котором будет работать приложение
EXPOSE 3001

# Команда для запуска приложения
CMD ["npm", "run", "start:dev", "--workspace=prodvor-backend"]
