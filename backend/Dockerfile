# 1. Base image with pnpm installed
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage
# This stage installs all dependencies for the entire monorepo
FROM base AS dependencies
WORKDIR /usr/src/app

# Copy dependency definition files from root and workspaces
COPY pnpm-lock.yaml .
COPY package.json .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
# This stage builds the backend application
FROM base AS builder
WORKDIR /usr/src/app

# Copy all files from dependencies stage (including node_modules)
COPY --from=dependencies /usr/src/app/ .

# Copy backend source code and other necessary files
COPY backend/ ./backend/
COPY prisma/ ./prisma/
COPY tsconfig.json .

# Build the backend
RUN pnpm --filter prodvor-backend build

# 4. Runner stage
# This is the final, optimized image
FROM base AS runner
WORKDIR /usr/src/app

# Copy production dependencies and built code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/package.json .

# Copy Prisma schema, it's needed at runtime
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3001
CMD ["pnpm", "start:backend"]
