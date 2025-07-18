# === STAGE 1: Builder ===
# Этот этап устанавливает все зависимости (включая dev) и компилирует проект.
FROM node:20 as builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем корневые файлы манифеста
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Копируем package.json каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости, включая devDependencies для сборки.
# --frozen-lockfile используется для CI для гарантии соответствия версий.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем ВЕСЬ остальной исходный код (после установки зависимостей, чтобы не перезаписывать node_modules)
COPY . .

# Собираем только фронтенд-проект
RUN pnpm --filter prodvor-frontend build

# === STAGE 2: Pruner ===
# Этот этап удаляет все dev-зависимости, оставляя только production.
FROM node:20 as pruner

WORKDIR /usr/src/app

# Включаем corepack
RUN corepack enable

# Копируем только артефакты сборки и package.json из builder'а
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Устанавливаем ТОЛЬКО production-зависимости для фронтенда.
# Команда `deploy` специально создана для таких сценариев.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --prod --filter prodvor-frontend ./frontend

# === STAGE 3: Runner ===
# Финальный, легковесный образ для запуска приложения.
FROM node:20-alpine

WORKDIR /app

# Копируем собранный проект и production-версию node_modules
COPY --from=pruner /usr/src/app/frontend/.next ./.next
COPY --from=pruner /usr/src/app/frontend/public ./public
COPY --from=pruner /usr/src/app/frontend/package.json ./package.json
COPY --from=pruner /usr/src/app/frontend/node_modules ./node_modules

# Открываем порт
EXPOSE 9002

# Устанавливаем команду для запуска
CMD ["pnpm", "start"]
