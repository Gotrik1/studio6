# === Этап 1: Builder - Сборка проекта ===
FROM node:20 AS builder

# Установка системных зависимостей, если они понадобятся
# RUN apt-get update && apt-get install -y openssl

# Установка рабочей директории
WORKDIR /usr/src/app

# Копируем только файлы, необходимые для установки зависимостей, чтобы кэшировать этот слой
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Активация pnpm через corepack
RUN corepack enable

# Установка всех зависимостей. pnpm автоматически вызовет `prisma generate`, если он в postinstall
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем остальной исходный код
COPY . .

# Сборка фронтенд-приложения
RUN pnpm --filter prodvor-frontend build

# === Этап 2: Pruner - Подготовка production-зависимостей ===
FROM builder AS pruner

# Создание директории для production-сборки
WORKDIR /usr/src/app

# Важно: pnpm deploy требует наличия pnpm-workspace.yaml для корректной работы в воркспейсе
COPY pnpm-workspace.yaml ./

# Копируем артефакты сборки и package.json для установки только production-зависимостей
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Установка только production-зависимостей
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --prod --filter prodvor-frontend ./frontend

# === Этап 3: Runner - Финальный образ ===
FROM node:20-alpine AS runner

WORKDIR /app

# Установка системных зависимостей, если они нужны для работы приложения
# RUN apk add --no-cache openssl

# Устанавливаем пользователя без root-прав для безопасности
USER node

# Копируем собранное приложение и production-зависимости из предыдущего этапа
COPY --from=pruner --chown=node:node /usr/src/app/frontend ./frontend
COPY --from=pruner --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/package.json ./

# Установка переменной окружения для Next.js
ENV NODE_ENV=production

# Открываем порт, на котором работает приложение
EXPOSE 9002

# Команда для запуска приложения
CMD ["pnpm", "start:frontend"]
