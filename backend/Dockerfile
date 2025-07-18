# === Base Stage ===
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

# === Builder Stage ===
FROM base as builder
WORKDIR /usr/src/app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter prodvor-backend build

# === Pruner Stage ===
FROM base as pruner
WORKDIR /usr/src/app
RUN corepack enable

COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-backend ./backend

# === Runner Stage ===
FROM node:20-alpine as runner
WORKDIR /app
RUN apk add --no-cache openssl

COPY --from=pruner /usr/src/app/backend ./backend
COPY --from=pruner /usr/src/app/node_modules ./node_modules

EXPOSE 3001
CMD ["node", "backend/dist/main.js"]
