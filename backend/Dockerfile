# Dockerfile для бэкенда (NestJS)

# 1. Base stage для установки pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage для установки зависимостей
FROM base AS dependencies
WORKDIR /usr/src/app
COPY pnpm-lock.yaml .
COPY package.json .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter prodvor-backend...

# 3. Builder stage для сборки приложения
FROM base AS builder
ENV NODE_ENV=production
# Добавляем путь к исполняемым файлам pnpm
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
WORKDIR /usr/src/app

# Копируем зависимости из предыдущего стейджа
COPY --from=dependencies /usr/src/app/ .

# Копируем исходный код бэкенда
COPY backend/ ./backend/
COPY backend/prisma/ ./prisma/
COPY tsconfig.json .

# Генерируем Prisma-клиент
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд
RUN pnpm --filter prodvor-backend build

# 4. Runner stage для запуска приложения
FROM base AS runner
ENV NODE_ENV=production
# Добавляем путь к исполняемым файлам pnpm
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
WORKDIR /usr/src/app

# Копируем собранные файлы и зависимости
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package.json .
COPY --from=dependencies /usr/src/app/backend/package.json ./backend/package.json

# Команда для запуска приложения
CMD ["pnpm", "start:backend"]
