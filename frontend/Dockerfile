# 1. Base stage
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base AS dependencies
WORKDIR /usr/src/app

# Копируем корневой package.json и pnpm-lock.yaml
COPY pnpm-lock.yaml .
COPY package.json .
# Копируем package.json воркспейсов
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем все зависимости монорепозитория
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
FROM base AS builder
# Добавляем бинарники pnpm в PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
WORKDIR /usr/src/app

# Копируем установленные зависимости
COPY --from=dependencies /usr/src/app/ .

# Копируем исходный код фронтенда
COPY frontend/ ./frontend/
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.js .

# Собираем фронтенд
RUN pnpm --filter prodvor-frontend build

# 4. Runner stage
FROM base AS runner
# Добавляем бинарники pnpm в PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
WORKDIR /usr/src/app

# Копируем только необходимые для запуска файлы из builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/frontend ./frontend
COPY --from=builder /usr/src/app/package.json .

# Копируем public и .next/standalone директории
COPY --from=builder /usr/src/app/frontend/.next/standalone ./frontend/.next/standalone
COPY --from=builder /usr/src/app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
