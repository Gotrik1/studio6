# --- Base Stage ---
# Используем официальный образ Node.js с pnpm
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# --- Dependencies Stage ---
# Устанавливаем только зависимости, чтобы кэшировать этот слой
FROM base AS deps
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN pnpm install --no-frozen-lockfile

# --- Builder Stage ---
# Собираем production-ready артефакты
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Генерируем Prisma Client ПЕРЕД сборкой
RUN pnpm --filter prodvor-backend prisma:generate

# Собираем только backend, так как это Dockerfile для бэкенда
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
# Создаем финальный, легковесный образ для запуска
FROM base AS runner
WORKDIR /usr/src/app

# Копируем мета-файлы для pnpm
COPY --from=builder /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Устанавливаем только production зависимости
RUN pnpm install --prod --no-frozen-lockfile

# Копируем собранный backend
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Копируем схему Prisma для runtime
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Копируем node_modules с сгенерированным Prisma Client
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Копируем остальные production-зависимости
COPY --from=deps /usr/src/app/node_modules ./node_modules


EXPOSE 3001
CMD ["pnpm", "start:backend"]
