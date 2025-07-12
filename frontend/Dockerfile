# ---- Base Stage ----
FROM node:20-slim AS base
WORKDIR /app
RUN npm install -g pnpm

# ---- Dependencies Stage ----
FROM base AS deps
WORKDIR /app

# Копируем только файлы манифестов для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies для сборки
RUN pnpm install --frozen-lockfile

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/package.json ./frontend/package.json
COPY --from=deps /app/package.json ./package.json

# Копируем исходный код фронтенда
COPY frontend/ ./frontend/

# Копируем tsconfig, который нужен для сборки Next.js
COPY tsconfig.json ./

# Устанавливаем PATH, чтобы Docker мог найти исполняемый файл `next`
ENV PATH="/app/node_modules/.bin:$PATH"

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# ---- Runner Stage (Final) ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Копируем манифесты для установки ТОЛЬКО production зависимостей
COPY --from=builder /app/package.json \
     /app/pnpm-lock.yaml \
     /app/pnpm-workspace.yaml \
     ./
COPY --from=builder /app/frontend/package.json ./frontend/

# Устанавливаем только production зависимости
RUN pnpm install --prod --frozen-lockfile

# Копируем собранный Next.js-проект из builder stage
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/next.config.mjs ./frontend/

# Команда для запуска Next.js в production режиме
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
