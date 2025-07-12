# 1. Base stage with pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base AS dependencies
WORKDIR /app

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
ENV PATH="/app/node_modules/.bin:$PATH"
WORKDIR /app

# Копируем все из предыдущего стейджа, включая node_modules
COPY --from=dependencies /app/ .

# Копируем исходный код фронтенда
COPY frontend/ ./frontend/
COPY tsconfig.json .
COPY next-env.d.ts .
COPY tailwind.config.ts .
COPY components.json .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build


# 4. Runner stage
FROM base AS runner
# Добавляем бинарники pnpm в PATH
ENV PATH="/app/node_modules/.bin:$PATH"
WORKDIR /app

# Копируем только необходимые для запуска файлы из builder'а
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/frontend/public ./frontend/public

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
