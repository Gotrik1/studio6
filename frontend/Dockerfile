FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем все манифесты пакетов
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости монорепозитория
RUN npm install

# Копируем исходный код фронтенда
COPY frontend/ ./frontend/
COPY tailwind.config.ts postcss.config.js components.json tsconfig.json ./

# Собираем фронтенд
RUN npm run build --workspace=prodvor-frontend

# Удаляем dev-зависимости для уменьшения размера образа
RUN npm prune --production

# Открываем порт
EXPOSE 9002

# Запускаем приложение в продакшен-режиме
CMD ["npm", "start", "--workspace=prodvor-frontend"]
