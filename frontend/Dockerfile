# --- Base Stage ---
# Используем один и тот же базовый образ для всех стадий, чтобы обеспечить консистентность
FROM node:20-alpine AS base
RUN npm install -g pnpm@10.13.1

# --- Builder Stage ---
# Эта стадия устанавливает все зависимости, генерирует Prisma-клиент (если нужно) и собирает production-билд
FROM base AS builder
WORKDIR /usr/src/app

# Копируем только файлы манифестов для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости для всех воркспейсов
RUN pnpm install --frozen-lockfile

# Копируем весь остальной код
COPY . .

# Собираем только frontend, так как это Dockerfile для фронтенда
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
# Финальная, легковесная стадия, которая содержит только то, что нужно для запуска
FROM base AS runner
WORKDIR /app

# Копируем необходимые артефакты из builder-стадии
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/next.config.mjs
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/frontend/node_modules ./frontend/node_modules

# Устанавливаем production-зависимости (если они есть, обычно для Next.js это не нужно в таком виде, но для полноты)
# Этот шаг можно раскомментировать, если появятся специфичные runtime-зависимости
# RUN pnpm --filter prodvor-frontend --prod install

ENV NODE_ENV=production

EXPOSE 9002

CMD ["pnpm", "start:frontend"]
