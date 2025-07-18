# === Этап 1: Builder - Сборка и компиляция ===
FROM node:20 AS builder

# Prisma требует OpenSSL для работы с БД
RUN apt-get update && apt-get install -y openssl

# Установка рабочей директории
WORKDIR /usr/src/app

# Копируем только файлы, необходимые для установки зависимостей, чтобы кэшировать этот слой
# Это самый важный шаг для корректной работы pnpm в монорепозитории
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Активация pnpm через corepack
RUN corepack enable

# Копируем схему Prisma ДО установки зависимостей
# Это критично для того, чтобы `prisma generate` сработал на следующем шаге
COPY backend/prisma ./backend/prisma

# Установка ВСЕХ зависимостей, включая devDependencies.
# pnpm автоматически вызовет `prisma generate` из-за `postinstall` в package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Теперь, когда Prisma Client сгенерирован, копируем остальной исходный код
COPY . .

# Компиляция TypeScript в JavaScript
RUN pnpm --filter prodvor-backend build

# === Этап 2: Pruner - Подготовка production-зависимостей ===
FROM builder AS pruner

WORKDIR /usr/src/app

# Важно: pnpm deploy требует наличия pnpm-workspace.yaml для корректной работы
COPY pnpm-workspace.yaml ./

# Копируем скомпилированный проект и package.json из этапа builder
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Устанавливаем только production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --prod --filter prodvor-backend ./backend

# === Этап 3: Runner - Финальный, легковесный образ ===
FROM node:20-alpine AS runner

WORKDIR /app

# Установка OpenSSL, необходимого для работы Prisma Client в runtime
RUN apk add --no-cache openssl

# Создаем пользователя без root-прав для безопасности
USER node

# Копируем скомпилированное приложение и production-зависимости из этапа pruner
COPY --from=pruner --chown=node:node /usr/src/app/backend/dist ./backend/dist
COPY --from=pruner --chown=node:node /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder --chown=node:node /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder --chown=node:node /usr/src/app/backend/prisma ./backend/prisma

# Установка переменной окружения
ENV NODE_ENV=production

# Открываем порт, на котором работает приложение
EXPOSE 3001

# Команда для запуска приложения
CMD ["node", "backend/dist/main.js"]
