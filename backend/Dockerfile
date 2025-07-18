# Этап 1: Установка зависимостей и сборка проекта
FROM node:20 as builder

# Устанавливаем OpenSSL, необходимый для Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем только необходимые для установки зависимостей файлы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости. На этом шаге сработает `prisma generate`.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной код проекта (ВАЖНО: после pnpm install)
COPY . .

# Собираем только бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 2: Подготовка production-версии node_modules
FROM node:20 as pruner
WORKDIR /usr/src/app

# Включаем corepack
RUN corepack enable

COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# Устанавливаем только production-зависимости
RUN pnpm --filter prodvor-backend deploy --prod backend/

# Этап 3: Создание финального легковесного образа
FROM node:20-alpine as runner
WORKDIR /app

# Устанавливаем OpenSSL, необходимый для Prisma Client в рантайме
RUN apk add --no-cache openssl

# Копируем скомпилированный код из builder
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/prisma ./prisma

# Копируем production-версию node_modules из pruner
COPY --from=pruner /usr/src/app/backend/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/package.json .

# Открываем порт и запускаем приложение
EXPOSE 3001
CMD ["node", "dist/main"]
