# Используем официальный образ Node.js 20 в качестве базового.
# Alpine-версия выбрана для уменьшения размера итогового образа.
FROM node:20-alpine AS base

# Устанавливаем pnpm глобально внутри образа.
RUN npm i -g pnpm

# Устанавливаем рабочую директорию.
WORKDIR /usr/src/app

# -----------------
# Dependencies
# -----------------
FROM base AS dependencies

# Копируем package.json и lock-файл для установки зависимостей.
# Это позволяет Docker кэшировать зависимости, если они не менялись.
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем зависимости с помощью pnpm.
# Флаг --frozen-lockfile гарантирует установку точных версий из lock-файла.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# -----------------
# Builder
# -----------------
FROM base AS builder
WORKDIR /usr/src/app

# Копируем зависимости из предыдущего слоя.
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/backend/node_modules ./backend/node_modules

# Копируем исходный код
COPY backend/ ./backend/
COPY prisma/ ./prisma/
# Копируем корневой tsconfig, чтобы NestJS мог его найти
COPY tsconfig.json .

# Генерируем Prisma-клиент
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем NestJS-приложение
RUN pnpm --filter prodvor-backend build

# -----------------
# Runner
# -----------------
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Копируем зависимости из билдера
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/pnpm-lock.yaml .
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules

# Копируем собранный код
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем важные файлы для работы Prisma
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# Копируем схему Prisma, она нужна для запуска
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3001
CMD ["pnpm", "start:backend"]
