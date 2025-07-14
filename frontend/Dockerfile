# --- Base Stage ---
# Используем базовый образ Node.js на Alpine.
FROM node:20-alpine as base
WORKDIR /app

# --- Builder Stage ---
# На этой стадии устанавливаются ВСЕ зависимости (включая devDependencies) и происходит сборка.
FROM base as builder
WORKDIR /usr/src/app

# Устанавливаем pnpm нужной версии
RUN npm install -g pnpm@10.13.1

# Копируем только файлы манифестов для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем package.json каждого воркспейса, чтобы pnpm понял, что устанавливать
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости
RUN pnpm install --frozen-lockfile

# Копируем весь остальной исходный код
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build


# --- Runner Stage (финальный образ для production) ---
# Это финальный, легковесный образ, который будет запускаться в production.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Копируем скомпилированный фронтенд из builder-стадии
COPY --from=builder /usr/src/app/frontend/.next /app/frontend/.next
COPY --from=builder /usr/src/app/frontend/public /app/frontend/public
COPY --from=builder /usr/src/app/frontend/package.json /app/frontend/package.json

# Устанавливаем pnpm и production-зависимости
RUN npm install -g pnpm@10.13.1
WORKDIR /app/frontend
RUN pnpm install --prod

WORKDIR /app

# Команда для запуска приложения
CMD ["pnpm", "start:frontend"]
