# -----------------------------------------------------------------------------
# Base Stage: Installs dependencies and prepares the base environment.
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install OpenSSL, a dependency for Prisma Client
RUN apk add --no-cache openssl

# -----------------------------------------------------------------------------
# Dependencies Stage: Installs npm packages.
# Using pnpm for efficient dependency management in a monorepo.
# -----------------------------------------------------------------------------
FROM base AS dependencies
WORKDIR /usr/src/app

# Копируем корневой package.json и pnpm-lock.yaml для установки зависимостей
COPY pnpm-lock.yaml ./
COPY package.json ./

# Копируем package.json бэкенда
COPY package.json ./backend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Build Stage: Compiles the NestJS application.
# -----------------------------------------------------------------------------
from dependencies AS builder
WORKDIR /usr/src/app

# Копируем исходный код бэкенда и Prisma-схему
COPY . .

# Генерируем Prisma Client (требует devDependencies, установленных ранее)
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем приложение
RUN pnpm --filter prodvor-backend build

# -----------------------------------------------------------------------------
# Runner Stage: Creates the final, lightweight image for production.
# -----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /usr/src/app

# Устанавливаем переменные окружения для Node
ENV NODE_ENV production

# Копируем только production-зависимости из builder-стадии
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/

# Копируем скомпилированное приложение
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Копируем Prisma-схему для runtime
COPY --from=builder /usr/src/app/prisma ./prisma
# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client


# Открываем порт, на котором будет работать приложение
EXPOSE 3001

# Команда для запуска приложения
CMD ["pnpm", "start:backend"]
