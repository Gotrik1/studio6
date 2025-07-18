# Этап 1: Установка зависимостей и сборка приложения
FROM node:20 AS builder
WORKDIR /usr/src/app

# Копируем манифесты зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем Prisma schema для генерации клиента
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

# Генерируем Prisma Client (на всякий случай, если он понадобится для сборки фронта)
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем production-сборку фронтенда
RUN pnpm --filter prodvor-frontend build

# Этап 2: Подготовка production-ready node_modules
FROM node:20 AS pruner
WORKDIR /usr/src/app

# Копируем манифесты для установки только production зависимостей
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Копируем скомпилированный код фронтенда
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Устанавливаем только production-зависимости, пропуская postinstall скрипты
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --prod --frozen-lockfile --ignore-scripts

# Этап 3: Финальный легковесный образ
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Копируем все production-ready артефакты из pruner
COPY --from=pruner /usr/src/app/ .

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
