# -------- Этап 1: Сборка и генерация Prisma Client --------
    FROM node:20 AS builder
    WORKDIR /usr/src/app
    
    # 1. Копируем манифесты
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY backend/package.json ./backend/
    COPY frontend/package.json ./frontend/
    COPY backend/prisma ./backend/prisma
    
    # 2. Устанавливаем все зависимости
    RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
        corepack enable && pnpm install --frozen-lockfile
    
    # 3. Копируем весь проект
    COPY . .
    
    # 4. Устанавливаем @prisma/client, если его не было
    RUN pnpm --filter prodvor-backend add @prisma/client
    
    # 5. Генерация Prisma Client
    RUN pnpm --filter prodvor-backend prisma:generate
    
    # 6. Сборка backend
    RUN pnpm --filter prodvor-backend build
    
    # -------- Этап 2: Подрезка и установка прод-зависимостей --------
    FROM node:20 AS pruner
    WORKDIR /usr/src/app
    
    COPY --from=builder /usr/src/app/package.json ./
    COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
    COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
    COPY --from=builder /usr/src/app/backend/package.json ./backend/
    COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
    COPY --from=builder /usr/src/app/backend/dist ./backend/dist
    COPY --from=builder /usr/src/app/backend/node_modules/@prisma ./node_modules/@prisma
    COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./node_modules/.prisma
    
    RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
        corepack enable && pnpm install --prod --frozen-lockfile --ignore-scripts
    
    # -------- Этап 3: Финальный runtime-образ --------
    FROM node:20-alpine AS runner
    WORKDIR /usr/src/app
    
    COPY --from=pruner /usr/src/app/ .
    
    EXPOSE 3001
    CMD ["node", "backend/dist/main.js"]
    