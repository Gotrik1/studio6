# Этап 1: Сборка приложения с dev-зависимостями
FROM node:20 AS builder

WORKDIR /usr/src/app

# Сначала копируем только манифесты для кэширования pnpm install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, так как она может быть нужна для type-checking на фронтенде
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && pnpm install --frozen-lockfile

# Теперь копируем весь остальной код
COPY . .

# Собираем приложение
RUN pnpm --filter prodvor-frontend build

# Этап 2: Установка только production-зависимостей
FROM node:20 AS pruner

WORKDIR /usr/src/app

# Копируем только манифесты
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Копируем скомпилированный код
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/

# Устанавливаем только production-зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && pnpm install --prod --ignore-scripts

# Этап 3: Создание финального, легковесного образа
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/frontend ./frontend
COPY --from=pruner /usr/src/app/public ./public

# Указываем пользователя для запуска
USER node

# Запускаем приложение
CMD ["pnpm", "start:frontend"]
