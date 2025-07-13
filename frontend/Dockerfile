# 1. Builder stage: Build the Next.js application
FROM node:20 AS builder

WORKDIR /usr/src/app

# Явно устанавливаем pnpm глобально
RUN npm install -g pnpm@9.15.9

# Копируем файлы манифеста для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости
RUN pnpm install --frozen-lockfile

# Копируем весь исходный код
COPY . .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# 2. Runner stage: Create a slim image for production
FROM node:20-slim AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Копируем только необходимые для запуска production-зависимости из builder-стадии
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./

RUN npm install -g pnpm@9.15.9
RUN pnpm install --prod --frozen-lockfile

# Копируем собранный Next.js-бандл
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/next.config.mjs

EXPOSE 9002

CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
