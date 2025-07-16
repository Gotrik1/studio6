# --- Base Stage ---
    FROM node:20 AS base
    RUN npm install -g pnpm@10.13.1
    
    # --- Builder Stage (сборка и установка всех зависимостей) ---
    FROM base AS builder
    WORKDIR /usr/src/app
    
    # Копируем только манифесты для кэширования зависимостей
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY backend/package.json ./backend/
    COPY frontend/package.json ./frontend/
    COPY backend/prisma ./backend/prisma
    
    # Устанавливаем все зависимости (dev и prod)
    RUN pnpm install --frozen-lockfile
    
    # Копируем весь проект
    COPY . .
    
    # Собираем только фронтенд
    RUN pnpm --filter prodvor-frontend build
    
    # --- Pruner Stage (оставить только необходимые prod-зависимости) ---
    FROM base AS pruner
    WORKDIR /app
    COPY --from=builder /usr/src/app/frontend /app/frontend
    COPY --from=builder /usr/src/app/package.json /app/package.json
    COPY --from=builder /usr/src/app/pnpm-lock.yaml /app/pnpm-lock.yaml
    COPY --from=builder /usr/src/app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
    
    # Production-зависимости только для фронта
    RUN pnpm install --prod --filter prodvor-frontend
    
    # --- Runner Stage (финальный образ) ---
    FROM base AS runner
    WORKDIR /app
    
    COPY --from=pruner /app/frontend /app/frontend
    COPY --from=pruner /app/node_modules /app/node_modules
    COPY --from=pruner /app/package.json /app/package.json
    
    # Запуск из папки фронта
    WORKDIR /app/frontend
    CMD ["pnpm", "start"]
    