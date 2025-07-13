# --- Builder Stage ---
FROM node:20-alpine AS builder

# Устанавливаем pnpm глобально
RUN npm install -g pnpm@10.13.1

# Устанавливаем рабочую директорию в корень проекта
WORKDIR /usr/src/app

# Копируем файлы манифеста для кэширования зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json .npmrc* ./

# Устанавливаем ВСЕ зависимости
RUN pnpm install

# Копируем весь остальной исходный код
COPY . .

# Собираем только frontend
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
FROM node:20-alpine as runner

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json фронтенда для запуска
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json

# Копируем только production-зависимости из builder-стадии
COPY --from=builder /usr/src/app/frontend/node_modules ./frontend/node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Копируем собранный Next.js проект
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Указываем команду для запуска приложения
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
