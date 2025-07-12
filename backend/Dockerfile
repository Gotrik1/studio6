# 1. Base stage with pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base AS dependencies
WORKDIR /usr/src/app

# Копируем корневой package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
# Копируем package.json воркспейсов
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
FROM base AS builder
# Добавляем бинарники pnpm в PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
WORKDIR /usr/src/app

# Копируем все из предыдущего стейджа, включая node_modules
COPY --from=dependencies /usr/src/app/ .

# Копируем исходный код бэкенда и другие необходимые файлы
COPY backend/ ./backend/
COPY backend/prisma/ ./prisma/
COPY tsconfig.json .

# Собираем бэкенд
RUN pnpm --filter prodvor-backend build

# 4. Runner stage
FROM base AS runner
# Добавляем бинарники pnpm в PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
WORKDIR /usr/src/app

# Копируем только необходимые для запуска файлы из builder'а
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/backend/package.json ./backend/
# Копируем схему Prisma, она нужна для запуска
COPY --from=builder /usr/src/app/prisma ./prisma/

EXPOSE 3001
CMD [ "node", "dist/main.js" ]
