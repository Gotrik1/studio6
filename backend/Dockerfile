# 1. Base stage for node and pnpm
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base AS dependencies
# Копируем корневой package.json и pnpm-lock.yaml
COPY pnpm-lock.yaml ./
COPY package.json ./
# Копируем package.json воркспейсов
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости монорепозитория
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
FROM base AS builder
# Копируем все зависимости, включая node_modules
COPY --from=dependencies /usr/src/app/ .

# Добавляем путь к исполняемым файлам pnpm
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Копируем исходный код бэкенда и файлы конфигурации
COPY backend/ ./backend/
COPY tsconfig.json .

# Генерируем Prisma-клиент
# Эта команда теперь должна работать, т.к. схема находится в backend/prisma/
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд
RUN pnpm --filter prodvor-backend build

# 4. Runner stage
FROM base AS runner
# Копируем только необходимые для запуска файлы
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Копируем схему Prisma, она нужна для запуска
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

EXPOSE 3001
CMD ["pnpm", "start:backend"]
