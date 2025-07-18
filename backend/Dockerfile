# ---- Base Stage ----
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /usr/src/app

# Copy root manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace manifests
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Copy prisma schema before install
COPY backend/prisma ./backend/prisma

# Install ALL dependencies (including dev) and generate Prisma Client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the backend application
RUN pnpm --filter prodvor-backend build

# ---- Pruner Stage ----
FROM base as pruner
WORKDIR /usr/src/app

COPY pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Install only production dependencies
RUN corepack enable && \
    pnpm deploy --prod --filter prodvor-backend ./backend

# ---- Runner Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# Copy production dependencies from pruner
COPY --from=pruner /usr/src/app/backend/node_modules ./node_modules
# Copy compiled code from builder
COPY --from=builder /usr/src/app/backend/dist ./dist

# Set the command to run the application
CMD ["node", "dist/main.js"]
