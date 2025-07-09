FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Устанавливаем openssl для Prisma
RUN apk add --no-cache openssl

# Копируем все манифесты пакетов
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости монорепозитория
RUN npm install

# Копируем весь исходный код
COPY . .

# Генерируем Prisma-клиент
RUN npx prisma generate --schema=./backend/prisma/schema.prisma

# Собираем бэкенд
RUN npm run build --workspace=prodvor-backend

# Удаляем dev-зависимости для уменьшения размера образа
RUN npm prune --production

# Открываем порт
EXPOSE 3001

# Запускаем приложение в продакшен-режиме
CMD ["node", "backend/dist/main"]
