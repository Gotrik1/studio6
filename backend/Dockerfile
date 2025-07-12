# ---- Base Stage ----
FROM node:20-slim AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# ---- Dependencies Stage ----
FROM base AS deps
WORKDIR /usr/src/app

# Копируем только файлы манифестов для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies для сборки
RUN pnpm install --frozen-lockfile

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /usr/src/app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/backend/package.json ./backend/package.json
COPY --from=deps /usr/src/app/package.json ./package.json

# Копируем исходный код бэкенда и Prisma схему
COPY backend/ ./backend/

# Устанавливаем PATH, чтобы Docker мог найти исполняемые файлы pnpm (prisma, nest)
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Генерируем Prisma клиент
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд
RUN pnpm --filter prodvor-backend build

# ---- Runner Stage (Final) ----
FROM base AS runner
WORKDIR /usr/src/app

# Копируем манифесты для установки ТОЛЬКО production зависимостей
COPY --from=builder /usr/src/app/package.json \
     /usr/src/app/pnpm-lock.yaml \
     /usr/src/app/pnpm-workspace.yaml \
     ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/

# Устанавливаем только production зависимости, чтобы уменьшить размер образа
RUN pnpm install --prod --frozen-lockfile

# Копируем собранный код из builder stage
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем сгенерированный Prisma-клиент
COPY --from=builder /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

# Копируем схему Prisma, необходимую для работы клиента в рантайме
COPY --from=builder /usr/src/app/backend/prisma/schema.prisma ./backend/prisma/schema.prisma

EXPOSE 3001
CMD ["node", "backend/dist/main"]
