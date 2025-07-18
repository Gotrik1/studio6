# Этап 1: Установка зависимостей и сборка проекта
FROM node:20 as builder
WORKDIR /usr/src/app

# Устанавливаем OpenSSL, если он понадобится для каких-либо зависимостей
RUN apt-get update && apt-get install -y openssl

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем только необходимые для установки зависимостей файлы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Устанавливаем все зависимости воркспейса.
# Это необходимо, чтобы pnpm мог корректно построить граф зависимостей.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной код проекта
COPY . .

# Собираем только фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Подготовка production-версии node_modules
FROM node:20 as pruner
WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/frontend ./frontend

# Устанавливаем только production-зависимости
RUN pnpm --filter prodvor-frontend deploy --prod frontend/

# Этап 3: Создание финального легковесного образа
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем переменные окружения для продакшена
ENV NODE_ENV=production

# Копируем скомпилированный код из builder
COPY --from=builder /usr/src/app/frontend/public ./public
COPY --from=builder /usr/src/app/frontend/.next ./.next
COPY --from=builder /usr/src/app/frontend/package.json .

# Копируем production-версию node_modules из pruner
COPY --from=pruner /usr/src/app/frontend/node_modules ./node_modules

# Открываем порт и запускаем приложение
EXPOSE 9002
CMD ["pnpm", "start"]
