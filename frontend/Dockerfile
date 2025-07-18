# Этап 1: Сборка приложения
FROM node:20 as builder

WORKDIR /app

# Копируем только необходимые для установки зависимостей файлы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости (включая dev)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

# Собираем только фронтенд
RUN pnpm --filter prodvor-frontend build

# Этап 2: Подготовка production-зависимостей
FROM node:20 as pruner

WORKDIR /app

# Копируем только манифесты и скомпилированный код
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

# Устанавливаем ТОЛЬКО production-зависимости, необходимые для фронтенда
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm deploy --legacy --prod --filter prodvor-frontend ./


# Этап 3: Финальный легковесный образ
FROM node:20-alpine as runner

WORKDIR /app

# Копируем production-зависимости и скомпилированный код из pruner'а
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=pruner /app/frontend ./frontend

EXPOSE 9002

CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
