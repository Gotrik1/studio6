# Dockerfile для фронтенда (Next.js)

# 1. Base stage для установки pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage для установки зависимостей
FROM base AS dependencies
WORKDIR /app
COPY pnpm-lock.yaml .
COPY package.json .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter prodvor-frontend...

# 3. Builder stage для сборки приложения
FROM base AS builder
ENV NODE_ENV=production
# Добавляем путь к исполняемым файлам pnpm
ENV PATH="/app/node_modules/.bin:$PATH"
WORKDIR /app

# Копируем зависимости из предыдущего стейджа
COPY --from=dependencies /app/ .

# Копируем исходный код фронтенда
COPY frontend/ .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# 4. Runner stage для запуска приложения
FROM base AS runner
ENV NODE_ENV=production
# Добавляем путь к исполняемым файлам pnpm
ENV PATH="/app/node_modules/.bin:$PATH"
WORKDIR /app

# Копируем собранные файлы и зависимости
COPY --from=builder /app/.next ./.next
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json .
COPY --from=dependencies /app/frontend/package.json ./frontend/
COPY frontend/public ./public
COPY frontend/next.config.js .

# Команда для запуска приложения
CMD ["pnpm", "start:frontend"]
