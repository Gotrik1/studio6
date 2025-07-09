# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем package.json файлы для каждого воркспейса и корневой
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Устанавливаем зависимости для всех воркспейсов
RUN npm install --frozen-lockfile

# Копируем исходный код
COPY . .

# Собираем фронтенд
RUN npm run build --workspace=prodvor-frontend


# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Копируем package.json файлы снова
COPY --from=builder /app/package.json ./
COPY --from=builder /app/frontend/package.json ./frontend/

# Копируем только production-зависимости из builder-стейджа
COPY --from=builder /app/node_modules ./node_modules

# Копируем собранный фронтенд
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

# Копируем конфигурационные файлы фронтенда
COPY --from=builder /app/frontend/next.config.ts ./frontend/next.config.ts
COPY --from=builder /app/postcss.config.js ./
COPY --from=builder /app/tailwind.config.ts ./

# Устанавливаем порт
EXPOSE 9002
ENV PORT 9002

# Запускаем приложение
CMD ["npm", "start", "--workspace=prodvor-frontend"]
