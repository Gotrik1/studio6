# Этап 1: Установка зависимостей
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /usr/src/app

# Копируем корневой package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
# Копируем package.json воркспейсов
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Копируем pnpm-workspace.yaml
COPY pnpm-workspace.yaml ./

# Устанавливаем ВСЕ зависимости монорепозитория
RUN pnpm install --frozen-lockfile --prod=false

# Этап 2: Сборка бэкенда
FROM base AS builder
WORKDIR /usr/src/app

# Копируем зависимости из предыдущего этапа
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/backend ./backend
COPY --from=dependencies /usr/src/app/package.json .
COPY --from=dependencies /usr/src/app/pnpm-lock.yaml .
COPY --from=dependencies /usr/src/app/pnpm-workspace.yaml .


# Копируем остальные файлы, необходимые для сборки
COPY backend/tsconfig.json ./backend/
COPY tsconfig.json .
COPY backend/nest-cli.json ./backend/
COPY backend/src ./backend/src
COPY backend/prisma ./backend/prisma

# Собираем только бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 3: Финальный образ для запуска
FROM base AS runner
WORKDIR /usr/src/app

# Копируем только необходимые для запуска файлы из builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/package.json ./package.json

# Копируем схему Prisma, она нужна для запуска
COPY --from=builder /usr/src/app/backend/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]
