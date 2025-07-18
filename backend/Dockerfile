# /backend/Dockerfile

# ---- Base ----
FROM node:20 as base
# Install OpenSSL, needed for Prisma
RUN apt-get update && apt-get install -y openssl
# Enable pnpm via corepack
RUN corepack enable

WORKDIR /usr/src/app

# ---- Builder ----
FROM base as builder

# Copy root manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
# A wildcard for .npmrc is used to also match .npmrc-local if it exists

# Copy workspace package.json files
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Copy prisma schema
COPY backend/prisma ./backend/prisma

# Install ALL dependencies (including dev) and run prisma generate
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the backend
RUN pnpm --filter prodvor-backend build

# ---- Pruner ----
FROM base as pruner
WORKDIR /usr/src/app

# Copy only necessary files from the builder stage
COPY --from=builder /usr/src/app/pnpm-workspace.yaml .
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/
# Also copy prisma schema for runtime
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Install ONLY production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter prodvor-backend deploy --prod ./backend

# ---- Runner ----
FROM node:20-alpine as runner
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV production

# Copy built app and node_modules from the pruner stage
COPY --from=pruner /usr/src/app/backend .

# Expose port and start the app
EXPOSE 3001
CMD ["node", "dist/main"]
