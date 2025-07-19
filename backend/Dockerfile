################################################################################
# Этап 0: базовый образ с pnpm@10.13.1 через Corepack
################################################################################
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Включаем Corepack и принудительно устанавливаем нужную версию pnpm
RUN corepack enable \
 && corepack prepare pnpm@10.13.1 --activate

################################################################################
# Этап 1: сборка + генерация Prisma
################################################################################
FROM base AS builder
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

# Повторно включаем corepack на всякий случай (особенность многоэтапных сборок)
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter prodvor-backend prisma:generate
RUN pnpm --filter prodvor-backend build

################################################################################
# Этап 2: установка production-зависимостей
################################################################################
FROM base AS pruner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --ignore-scripts

################################################################################
# Этап 3: финальный runtime-образ
################################################################################
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Повторно включаем corepack и pnpm, если вдруг будем использовать
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

COPY --from=pruner /usr/src/app/ ./
EXPOSE 3001

CMD ["node", "backend/dist/main.js"]


################################################################################
# Этап 4: миграции — со всеми зависимостями и prisma CLI
################################################################################
FROM builder AS migrator