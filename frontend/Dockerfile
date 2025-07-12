# -----------------------------------------------------------------------------
# Этап 1: Установка зависимостей
# -----------------------------------------------------------------------------
FROM node:20-alpine AS dependencies

WORKDIR /usr/src/app

# Копируем корневые файлы для установки зависимостей воркспейса
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Копируем package.json фронтенда
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки)
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --filter prodvor-frontend

# -----------------------------------------------------------------------------
# Этап 2: Сборка проекта
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Копируем зависимости из предыдущего этапа
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/frontend/node_modules ./frontend/node_modules

# Копируем package.json фронтенда, чтобы Next.js мог его найти
COPY frontend/package.json ./frontend/

# Копируем исходный код фронтенда
COPY frontend/ ./frontend/
# Копируем корневой tsconfig, чтобы Next.js мог его найти
COPY tsconfig.json .

# Устанавливаем NEXT_PUBLIC_BACKEND_URL во время сборки
# Это пример, в реальном CI/CD это будет передаваться через --build-arg
ARG NEXT_PUBLIC_BACKEND_URL=http://kong:8000
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Собираем приложение
RUN pnpm --filter prodvor-frontend build

# -----------------------------------------------------------------------------
# Финальный этап: Production-образ
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Копируем только production-зависимости (если они есть)
# Next.js standalone output включает node_modules, но этот шаг на всякий случай
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/frontend/node_modules ./frontend/node_modules

# Копируем собранный проект (Next.js standalone build)
COPY --from=builder /usr/src/app/frontend/.next/standalone ./
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/.next/static ./frontend/.next/static

# Устанавливаем правильного пользователя
USER node

EXPOSE 9002

ENV PORT=9002

CMD ["node", "frontend/server.js"]
