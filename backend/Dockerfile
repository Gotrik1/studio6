# Dockerfile for NestJS Backend

# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base AS dependencies
# Копируем package.json и package-lock.json всего монорепозитория
COPY package.json package-lock.json ./
# Устанавливаем зависимости только для backend
RUN npm install --workspace=prodvor-backend --omit=dev

# ---- Builder ----
FROM base AS builder
# Копируем зависимости из предыдущего шага
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package.json ./package.json
# Копируем исходный код бэкенда
COPY backend/ ./
# Генерируем Prisma Client
RUN npx prisma generate
# Собираем приложение
RUN npm run build --workspace=prodvor-backend

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production
# Копируем собранное приложение и зависимости
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package.json ./package.json
COPY backend/prisma ./prisma
# Запускаем приложение
CMD ["node", "dist/main.js"]
