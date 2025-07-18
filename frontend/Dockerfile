# === Base Stage ===
FROM node:20 as base

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
RUN pnpm --filter prodvor-frontend build

# === Pruner Stage ===
FROM base as pruner
WORKDIR /usr/src/app
RUN corepack enable

COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-frontend ./frontend


# === Runner Stage ===
FROM node:20-alpine as runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=pruner /usr/src/app/frontend ./frontend
COPY --from=pruner /usr/src/app/node_modules ./node_modules

EXPOSE 9002
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
