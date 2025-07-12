# 1. Base stage with pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base AS dependencies
WORKDIR /usr/src/app

# Копируем корневой package.json и pnpm-lock.yaml
COPY pnpm-lock.yaml .
COPY package.json .
COPY pnpm-workspace.yaml .
# Копируем package.json воркспейсов
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости для всех воркспейсов
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


# 3. Builder stage
FROM base AS builder
WORKDIR /usr/src/app

# Явно добавляем путь к бинарным файлам pnpm в PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Копируем установленные зависимости
COPY --from=dependencies /usr/src/app/ .

# Копируем исходный код бэкенда и схему Prisma
COPY backend/ ./backend/
COPY prisma/ ./prisma/
COPY tsconfig.json .

# Генерируем Prisma-клиент
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд
RUN pnpm --filter prodvor-backend build


# 4. Runner stage
FROM base AS runner
WORKDIR /usr/src/app

# Явно добавляем путь к бинарным файлам pnpm в PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Копируем только необходимые для запуска артефакты
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/node_modules/.pnpm ./node_modules/.pnpm

# Копируем сгенерированный Prisma-клиент
COPY --from=builder /usr/src/app/node_modules/.pnpm/@prisma+client* ./node_modules/.pnpm/@prisma+client*
COPY --from=builder /usr/src/app/node_modules/.pnpm/prisma* ./node_modules/.pnpm/prisma*

# Убедимся, что Prisma-клиент доступен для NestJS
RUN npx prisma generate

EXPOSE 3001
CMD ["node", "dist/main"]
