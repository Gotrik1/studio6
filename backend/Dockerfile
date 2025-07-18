# Этап 1: Сборка приложения с dev-зависимостями
FROM node:20 AS builder

WORKDIR /usr/src/app

# Сначала копируем только манифесты для кэширования pnpm install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma до установки зависимостей, чтобы Prisma Client мог быть сгенерирован
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies, чтобы был доступен Prisma CLI
# и запускался postinstall скрипт
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && pnpm install --frozen-lockfile

# Явная генерация Prisma Client, чтобы гарантировать его наличие
RUN pnpm --filter prodvor-backend prisma:generate

# Теперь копируем весь остальной код
COPY . .

# Собираем приложение
RUN pnpm --filter prodvor-backend build

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
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем сгенерированный Prisma Client
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client

# Устанавливаем только production-зависимости, игнорируя скрипты (Prisma уже сгенерирован)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && pnpm install --prod --ignore-scripts

# Этап 3: Создание финального, легковесного образа
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Копируем production-зависимости и скомпилированный код из pruner
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/dist ./backend/dist

# Запускаем приложение
CMD ["node", "backend/dist/main.js"]
