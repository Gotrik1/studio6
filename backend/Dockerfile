################################################################################
# Этап 0: базовый образ с заранее настроенным pnpm@10.13.1
################################################################################
FROM node:20 AS base

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Обновляем Corepack (чтобы избежать ошибок верификации), включаем pnpm
RUN npm install -g corepack@0.31.0 && \
    corepack enable pnpm@10.13.1

################################################################################
# Этап 1: сборка и генерация Prisma Client
################################################################################
FROM base AS builder
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter prodvor-backend add @prisma/client
RUN pnpm --filter prodvor-backend prisma:generate
RUN pnpm --filter prodvor-backend build

################################################################################
# Этап 2: production-зависимости
################################################################################
FROM base AS pruner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/node_modules/@prisma ./node_modules/@prisma

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --ignore-scripts

################################################################################
# Этап 3: лёгкий runtime-образ
################################################################################
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

COPY --from=pruner /usr/src/app/ .

EXPOSE 3001
CMD ["node", "backend/dist/main.js"]
