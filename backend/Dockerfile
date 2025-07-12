# ----------------- Base Stage -----------------
# Используем официальный образ Node.js
FROM node:20-alpine as base

WORKDIR /usr/src/app

# Устанавливаем npm в качестве пакетного менеджера по умолчанию
# npm уже включен в этот образ, так что дополнительных установок не требуется

# ----------------- Dependencies Stage -----------------
# Этот этап устанавливает все зависимости, включая devDependencies
FROM base as dependencies

# Копируем package.json и package-lock.json для установки зависимостей
# Копируем корневой package.json для определения воркспейсов
COPY package.json package-lock.json ./
# Копируем package.json бэкенда
COPY backend/package.json ./backend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN npm install

# ----------------- Build Stage -----------------
# Этот этап собирает приложение
FROM dependencies as builder

# Копируем исходный код
COPY . .

# Генерируем Prisma Client. Это критически важный шаг перед сборкой.
RUN npm run prisma:generate --workspace=prodvor-backend

# Собираем приложение
RUN npm run build --workspace=prodvor-backend

# ----------------- Runner Stage -----------------
# Финальный, легковесный образ для запуска приложения
FROM node:20-alpine as runner

WORKDIR /usr/src/app

# Копируем production-зависимости из 'dependencies'
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package.json ./package.json
COPY --from=dependencies /usr/src/app/backend/package.json ./backend/package.json

# Копируем скомпилированное приложение из 'builder'
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Копируем схему Prisma, она нужна для Prisma Client в рантайме
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Указываем путь к исполняемым файлам из node_modules
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Команда для запуска приложения в режиме разработки (с --watch)
CMD ["npm", "run", "start:dev", "--workspace=prodvor-backend"]
