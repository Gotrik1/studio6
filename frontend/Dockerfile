# Этап 1: Установка зависимостей
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app

# Копируем корневой package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
# Копируем package.json воркспейсов
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Копируем pnpm-workspace.yaml
COPY pnpm-workspace.yaml ./

# Устанавливаем ВСЕ зависимости монорепозитория
RUN pnpm install --frozen-lockfile --prod=false


# Этап 2: Сборка фронтенда
FROM base AS builder
WORKDIR /app
# Копируем зависимости из предыдущего этапа
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/frontend ./frontend
COPY --from=dependencies /app/package.json .
COPY --from=dependencies /app/pnpm-lock.yaml .
COPY --from=dependencies /app/pnpm-workspace.yaml .

# Копируем остальные файлы, необходимые для сборки
COPY frontend/public ./frontend/public
COPY frontend/src ./frontend/src
COPY frontend/components.json ./frontend/
COPY frontend/next.config.ts ./frontend/
COPY frontend/next-env.d.ts ./frontend/
COPY frontend/postcss.config.mjs ./frontend/
COPY frontend/tailwind.config.ts ./frontend/
COPY frontend/tsconfig.json ./frontend/

# Собираем только фронтенд
RUN pnpm --filter prodvor-frontend build


# Этап 3: Финальный образ для запуска
FROM base AS runner
WORKDIR /app

# Копируем только необходимые для запуска файлы из builder
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./frontend/package.json
COPY --from=builder /app/frontend/public ./frontend/public

EXPOSE 9002

ENV NODE_ENV=production

CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
