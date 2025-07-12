# Этап 1: Установка всех зависимостей, включая devDependencies
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая dev-зависимости, чтобы `nest` CLI был доступен
RUN npm install

# Этап 2: Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY . .
# Копируем УЖЕ установленные зависимости из предыдущего этапа
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Запускаем сборку, теперь команда `nest` будет найдена
RUN npm run build --workspace=prodvor-backend

# Этап 3: Подготовка production-зависимостей
# Этот этап нужен для того, чтобы в финальном образе были только production-зависимости
FROM node:20-alpine AS prod-dependencies
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ТОЛЬКО production-зависимости
RUN npm install --omit=dev

# Этап 4: Финальный production-образ
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Копируем production-зависимости
COPY --from=prod-dependencies /usr/src/app/node_modules ./node_modules

# Копируем собранное приложение
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./package.json

EXPOSE 3001

CMD ["node", "dist/main.js"]
