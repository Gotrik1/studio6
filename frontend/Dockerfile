# -----------------------------------------------------------------------------
# Stage 1: Установка зависимостей
# -----------------------------------------------------------------------------
FROM node:20-alpine AS dependencies

WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем package.json и pnpm-lock.yaml из корня и воркспейсов
COPY pnpm-lock.yaml .
COPY package.json .
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 2: Сборка приложения
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем зависимости из предыдущего шага
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json .
COPY --from=dependencies /app/pnpm-lock.yaml .
COPY --from=dependencies /app/frontend ./frontend
COPY --from=dependencies /app/backend ./backend


# Копируем исходный код и конфигурационные файлы
COPY frontend/ ./frontend/
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.mjs .
COPY next.config.js .

# Собираем приложение
RUN pnpm --filter prodvor-frontend build

# Удаляем devDependencies для создания чистого production node_modules
RUN pnpm --filter prodvor-frontend deploy --prod /prod
RUN rm -rf node_modules
RUN mv /prod/node_modules .


# -----------------------------------------------------------------------------
# Final Stage: Production Image
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Копируем production-зависимости и package.json из builder-стадии
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json

# Копируем собранное приложение Next.js
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

EXPOSE 9002

# Запускаем приложение
CMD ["pnpm", "start:frontend"]
