# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base AS dependencies
# Копируем файлы package.json и pnpm-lock.yaml из корня и из каждого воркспейса
COPY pnpm-lock.yaml .
COPY package.json .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Устанавливаем зависимости для всего монорепозитория
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
# Копируем установленные зависимости
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/backend/node_modules ./backend/node_modules
# Копируем исходный код
COPY backend/ ./backend/
COPY backend/prisma/ ./backend/prisma/
# Копируем корневой tsconfig, чтобы NestJS мог его найти
COPY tsconfig.json .
# Генерируем Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate
# Собираем приложение
RUN pnpm --filter prodvor-backend build

# ---- Runner ----
FROM base AS runner
# Копируем необходимые node_modules для запуска
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# Копируем схему Prisma, она нужна для запуска
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

EXPOSE 3001
CMD ["node", "backend/dist/main.js"]
