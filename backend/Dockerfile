# Dockerfile для Backend
# --- 1. Стадия зависимостей ---
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

COPY pnpm-lock.yaml .
COPY package.json .
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN npm i -g pnpm@9.15.9
RUN pnpm fetch

RUN pnpm install -r --offline --frozen-lockfile

# --- 2. Стадия сборки ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Копируем зависимости из предыдущей стадии
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=dependencies /usr/src/app/frontend/node_modules ./frontend/node_modules

# Копируем package.json файлы
COPY package.json .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем исходный код
COPY backend/ ./backend/
COPY prisma/ ./prisma/
# Копируем корневой tsconfig, чтобы NestJS мог его найти
COPY tsconfig.json .

# Запускаем сборку бэкенда
RUN npm i -g pnpm@9.15.9
RUN pnpm --filter prodvor-backend build

# --- 3. Финальный образ ---
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# Копируем схему Prisma, она нужна для запуска
COPY prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]
