# Этап 1: Базовый образ с системными зависимостями
FROM node:20 as base
WORKDIR /usr/src/app
# Устанавливаем OpenSSL, необходимый для Prisma в Alpine
# RUN apk add --no-cache openssl
# Для Debian/Ubuntu-based образов (node:20) это может не понадобиться, но на всякий случай:
RUN apt-get update && apt-get install -y openssl

# Этап 2: Установка зависимостей и сборка
FROM base as builder
# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma ДО установки, чтобы `prisma generate` сработал
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости (включая dev), что триггерит `prisma generate`
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем весь остальной код проекта
COPY . .

# Собираем только backend
RUN pnpm --filter prodvor-backend build

# Этап 3: Подготовка production-зависимостей
FROM base as pruner
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --filter prodvor-backend

# Этап 4: Финальный образ
FROM node:20-alpine as runner
WORKDIR /app
COPY --from=pruner /usr/src/app/backend/dist ./dist
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main.js"]
