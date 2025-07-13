# --- Builder Stage ---
FROM node:20-slim AS builder

WORKDIR /app

# Устанавливаем pnpm глобально
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

# Копируем корневые файлы конфигурации монорепозитория
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json для каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости
RUN pnpm install --no-frozen-lockfile

# Копируем ВЕСЬ исходный код
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

# Копируем только необходимые для production установки файлы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем только production зависимости
RUN pnpm install --prod --no-frozen-lockfile

# Явно запускаем prisma generate на всякий случай, если он понадобится
RUN pnpm --filter prodvor-backend exec prisma generate


# Копируем собранный фронтенд из builder-стадии
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package.json ./frontend/package.json

EXPOSE 9002

# Команда для запуска фронтенда в production режиме
CMD ["pnpm", "start:frontend"]
