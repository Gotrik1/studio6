# ---- Base ----
FROM node:20 AS base
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base AS deps
# Устанавливаем системные зависимости, включая OpenSSL
RUN apt-get update && apt-get install -y openssl

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@9.15.9

# Копируем только файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies
RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM deps AS builder
# Копируем весь исходный код проекта
COPY . .

# Генерируем Prisma Client, теперь когда у нас есть schema.prisma
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем backend приложение
RUN pnpm --filter prodvor-backend build

# ---- Runner ----
FROM node:20-slim AS runner
WORKDIR /usr/src/app

# Устанавливаем системные зависимости, включая OpenSSL, для production
RUN apt-get update && apt-get install -y openssl

# Устанавливаем pnpm глобально для runner-а
RUN npm install -g pnpm@9.15.9

# Копируем package.json и lock-файлы для установки production-зависимостей
COPY --from=builder /usr/src/app/package.json \
                    /usr/src/app/pnpm-lock.yaml \
                    /usr/src/app/pnpm-workspace.yaml \
                    ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Устанавливаем только production зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем схему Prisma для runtime
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Копируем сгенерированный Prisma Client и его движки из builder-стадии
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/.pnpm/@prisma* ./node_modules/.pnpm/@prisma

# Копируем собранное приложение из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Указываем команду для запуска приложения
CMD ["pnpm", "start:backend"]
