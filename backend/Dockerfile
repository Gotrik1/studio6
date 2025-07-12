# ---- Base Stage ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# ---- Dependencies Stage ----
FROM base AS dependencies
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

# ---- Build Stage ----
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN pnpm --filter prodvor-backend run prisma:generate
RUN pnpm --filter prodvor-backend run build

# ---- Production Stage ----
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN npm install -g pnpm

COPY --from=builder /usr/src/app/backend/dist ./dist
# We need the full node_modules from the builder stage for production run
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=builder /usr/src/app/backend/prisma/schema.prisma ./prisma/schema.prisma

CMD ["node", "dist/main"]
