# -----------------------------------------------------------------------------
# Этап 1: Установка всех зависимостей, включая devDependencies
# -----------------------------------------------------------------------------
FROM node:20-alpine as dependencies

# Устанавливаем pnpm глобально, чтобы он был доступен
RUN npm install -g pnpm

# Устанавливаем OpenSSL для корректной работы Prisma
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

# Копируем корневой package.json и lock-файл
COPY package.json pnpm-lock.yaml ./
# Копируем package.json бэкенда
COPY backend/package.json ./backend/
# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Этап 2: Сборка приложения
# -----------------------------------------------------------------------------
FROM dependencies as builder

# Копируем исходный код
COPY . .

# Генерируем Prisma Client (требует devDependencies, установленных ранее)
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем приложение
RUN pnpm --filter prodvor-backend build

# -----------------------------------------------------------------------------
# Этап 3: Создание чистового образа для продакшена
# -----------------------------------------------------------------------------
FROM node:20-alpine as runner

WORKDIR /usr/src/app

# Устанавливаем OpenSSL, так как он нужен Prisma Client для работы
RUN apk add --no-cache openssl

# Копируем корневой package.json и lock-файл
COPY package.json pnpm-lock.yaml ./
# Копируем package.json бэкенда
COPY backend/package.json ./backend/

# Устанавливаем ТОЛЬКО production-зависимости
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile

# Копируем собранное приложение и сгенерированный Prisma Client из этапа сборки
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# Копируем схему Prisma, она нужна для запуска
COPY prisma ./prisma

EXPOSE 3001

CMD ["node", "backend/dist/main"]
