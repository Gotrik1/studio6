# -- STAGE 1: BUILDER --
FROM node:20 AS builder

# 1. Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# 2. Копируем только файлы-манифесты для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# 3. Устанавливаем все зависимости, включая devDependencies
# Это необходимо для этапа сборки, который требует TypeScript, Nest CLI и т.д.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# 4. Копируем весь исходный код
COPY . .

# 5. Собираем только фронтенд-воркспейс
RUN pnpm --filter prodvor-frontend build


# -- STAGE 2: PRUNER --
# Этот этап нужен для того, чтобы в финальном образе были только production-зависимости,
# что значительно уменьшает его размер.
FROM node:20 AS pruner

# 1. Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# 2. Активируем pnpm
RUN corepack enable

# 3. Копируем скомпилированный проект и файлы-манифесты
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/next.config.mjs

# 4. Устанавливаем ТОЛЬКО production-зависимости
RUN pnpm deploy --legacy --prod --filter prodvor-frontend


# -- STAGE 3: RUNNER --
# Финальный, легковесный образ для запуска приложения.
FROM node:20-alpine AS runner

# 1. Устанавливаем рабочую директорию
WORKDIR /app

# 2. Копируем собранный проект и production-зависимости
COPY --from=pruner /usr/src/app/frontend .

# 3. Устанавливаем пользователя без root-прав для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# 4. Указываем порт
EXPOSE 9002

# 5. Команда для запуска
CMD ["pnpm", "start"]
