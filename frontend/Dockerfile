# 1. Base stage with pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base AS dependencies
WORKDIR /usr/src/app

# Копируем корневой package.json и pnpm-lock.yaml
COPY pnpm-lock.yaml .
COPY package.json .
COPY pnpm-workspace.yaml .
# Копируем package.json воркспейсов
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости для всех воркспейсов
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


# 3. Builder stage
FROM base AS builder
WORKDIR /app

# Явно добавляем путь к бинарным файлам pnpm в PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Копируем установленные зависимости из предыдущего этапа
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package.json ./package.json
COPY --from=dependencies /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=dependencies /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=dependencies /usr/src/app/frontend/package.json ./frontend/

# Копируем исходный код фронтенда
COPY frontend/ ./frontend/
COPY tsconfig.json .

# Устанавливаем переменные окружения для сборки
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# 4. Runner stage
FROM base AS runner
WORKDIR /app

# Явно добавляем путь к бинарным файлам pnpm в PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Копируем только необходимые для запуска артефакты
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/frontend/public ./frontend/public

EXPOSE 9002
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
