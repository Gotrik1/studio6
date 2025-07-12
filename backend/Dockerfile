# -----------------------------------------------------------------------------
# Stage 1: Установка зависимостей
# -----------------------------------------------------------------------------
FROM node:20-alpine AS dependencies

WORKDIR /usr/src/app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем package.json и pnpm-lock.yaml из корня и воркспейсов
COPY pnpm-lock.yaml .
COPY package.json .
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 2: Сборка приложения
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем зависимости из предыдущего шага
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package.json .
COPY --from=dependencies /usr/src/app/pnpm-lock.yaml .
COPY --from=dependencies /usr/src/app/backend ./backend
COPY --from=dependencies /usr/src/app/frontend ./frontend


# Копируем исходный код
COPY backend/ ./backend/
COPY prisma/ ./prisma/
# Копируем корневой tsconfig, чтобы NestJS мог его найти
COPY tsconfig.json .

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем приложение
RUN pnpm --filter prodvor-backend build

# Удаляем devDependencies для создания чистого production node_modules
RUN pnpm --filter prodvor-backend deploy --prod /prod
RUN rm -rf node_modules
RUN mv /prod/node_modules .


# -----------------------------------------------------------------------------
# Final Stage: Production Image
# -----------------------------------------------------------------------------
FROM node:20-alpine as runner

WORKDIR /usr/src/app

# Устанавливаем openssl
RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Копируем production-зависимости из builder-стадии
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/package.json ./package.json

# Копируем скомпилированный код
COPY --from=builder /usr/src/app/backend/dist ./dist

# Копируем Prisma Client и бинарные файлы
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# Копируем схему Prisma, она нужна для запуска
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]
