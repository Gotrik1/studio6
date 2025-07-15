# --- Base Stage (для установки системных зависимостей) ---
    FROM node:20-alpine as base
    RUN apk add --no-cache openssl && npm install -g pnpm@10.13.1

    
    # --- Builder Stage (для сборки TypeScript и генерации Prisma) ---
    FROM base as builder
    WORKDIR /usr/src/app
    
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY backend/package.json ./backend/
    COPY frontend/package.json ./frontend/
    COPY backend/prisma ./backend/prisma
    
    RUN pnpm --filter prodvor-backend install --config.allow-scripts=true
    RUN pnpm --filter prodvor-backend prisma:generate
    
    COPY . .
    RUN pnpm --filter prodvor-backend build
    
    # --- Pruner Stage (для production-зависимостей) ---
    FROM base as pruner
    WORKDIR /app
    COPY --from=builder /usr/src/app/backend ./backend
    COPY --from=builder /usr/src/app/package.json ./package.json
    COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml
    COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
    COPY --from=builder /usr/src/app/node_modules/.pnpm ./node_modules/.pnpm
    
    RUN pnpm --filter prodvor-backend install --prod --config.allow-scripts=true
    
    # --- Runner Stage (финальный образ для production) ---
    FROM base as runner
    WORKDIR /app
    COPY --from=pruner /app/backend/dist ./dist
    COPY --from=pruner /app/backend/package.json ./package.json
    COPY --from=pruner /app/node_modules ./node_modules
    COPY --from=pruner /app/backend/prisma ./prisma
    
    CMD ["node", "dist/main.js"]
    
    # --- Migrations Stage (для запуска миграций в CI) ---
    FROM builder as migrations
    WORKDIR /app
    COPY --from=builder /usr/src/app .
    CMD ["pnpm", "--filter", "prodvor-backend", "prisma:migrate:deploy"]
    