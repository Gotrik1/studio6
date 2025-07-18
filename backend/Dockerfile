# Этап 1: Сборка приложения
FROM node:20 as builder

WORKDIR /app

# Копируем только необходимые для установки зависимостей файлы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

# Устанавливаем все зависимости (включая dev) и генерируем Prisma Client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

# Собираем только бэкенд
RUN pnpm --filter prodvor-backend build

# Этап 2: Подготовка production-зависимостей
FROM node:20 as pruner

WORKDIR /app

# Копируем только манифесты и скомпилированный код
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist

# Устанавливаем ТОЛЬКО production-зависимости, необходимые для бэкенда
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm deploy --legacy --prod --filter prodvor-backend ./

# Этап 3: Финальный легковесный образ
FROM node:20-alpine as runner

WORKDIR /app

# Копируем production-зависимости и скомпилированный код из pruner'а
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=pruner /app/backend ./backend

EXPOSE 3001

CMD ["node", "backend/dist/main.js"]
