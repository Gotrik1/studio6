# ---- Base Stage ----
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

# ---- Builder Stage ----
FROM base as builder
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace-specific manifests
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Copy Prisma schema before installing dependencies
COPY backend/prisma ./backend/prisma

# Install ALL dependencies (including dev) and generate Prisma Client
RUN corepack enable && pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the backend application
RUN pnpm --filter prodvor-backend build

# ---- Pruner Stage ----
# This stage creates a lean node_modules with only production dependencies
FROM base as pruner
WORKDIR /usr/src/app

RUN corepack enable

COPY pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/

# Deploy to /prod/backend to create the correct directory structure
RUN pnpm deploy --legacy --prod --filter prodvor-backend /prod/backend

# ---- Runner Stage ----
# This is the final, lightweight image
FROM node:20-alpine as runner
WORKDIR /app

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Copy production dependencies and compiled code from the pruner stage
COPY --from=pruner /prod .

WORKDIR /app/backend
CMD ["node", "dist/main.js"]
