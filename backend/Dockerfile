
# --- Builder Stage ---
# This stage installs all dependencies (including dev) and builds the application.
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Копируем корневые файлы для pnpm workspace
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Копируем package.json для каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем ВСЕ зависимости, включая devDependencies, для сборки
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --no-frozen-lockfile

# Копируем исходный код бэкенда и Prisma схему
COPY backend ./backend
COPY prisma ./prisma

# Генерируем Prisma Client (необходимо до сборки)
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
# This stage creates the final, optimized image for production.
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Копируем корневые файлы для pnpm workspace
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Копируем package.json для каждого воркспейса
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем только production зависимости
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --prod --frozen-lockfile

# Копируем скомпилированный код из builder-стадии
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем Prisma схему и сгенерированный клиент из builder-стадии
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Команда для запуска приложения
CMD ["node", "backend/dist/main.js"]
