# Stage 1: Установка зависимостей
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

# Копируем файлы для установки зависимостей
COPY package.json .
COPY pnpm-lock.yaml .
COPY .npmrc .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------

# Stage 2: Сборка приложения
FROM dependencies AS builder
WORKDIR /usr/src/app

# Копируем все необходимое для сборки
COPY --from=dependencies /usr/src/app/package.json .
COPY --from=dependencies /usr/src/app/pnpm-lock.yaml .
COPY --from=dependencies /usr/src/app/backend/package.json ./backend/
COPY --from=dependencies /usr/src/app/frontend/package.json ./frontend/
COPY .npmrc .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter=prodvor-backend

# Копируем исходный код
COPY backend/ ./backend/
COPY prisma/ ./prisma/
# Копируем корневой tsconfig, чтобы NestJS мог его найти
COPY tsconfig.json .

# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем бэкенд
RUN pnpm --filter prodvor-backend build

# -----------------------------------------------------------------------------

# Stage 3: Финальный образ
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Устанавливаем OpenSSL для Prisma
RUN apk add --no-cache openssl

# Устанавливаем только production-зависимости, используя готовый lockfile
COPY package.json .
COPY pnpm-lock.yaml .
COPY .npmrc .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile

# Копируем скомпилированный код из builder'a
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Копируем node_modules, включая сгенерированный Prisma Client
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# Копируем схему Prisma, она нужна для запуска
COPY prisma ./prisma

EXPOSE 3001

CMD ["pnpm", "start:backend"]
