# 1. Base image with pnpm installed
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage
# This stage installs all dependencies for the entire monorepo
FROM base AS dependencies
WORKDIR /app

# Copy dependency definition files from root and workspaces
COPY pnpm-lock.yaml .
COPY package.json .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
# This stage builds the frontend application
FROM base AS builder
WORKDIR /app

# Copy all files from dependencies stage (including node_modules)
COPY --from=dependencies /app/ .

# Copy frontend source code and other necessary files
COPY frontend/ ./frontend/
COPY tsconfig.json .

# Build the frontend
RUN pnpm --filter prodvor-frontend build

# 4. Runner stage
# This is the final, optimized image
FROM base AS runner
WORKDIR /app

# Copy production dependencies and built code from the builder stage
COPY --from=builder /app/package.json .
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package.json ./frontend/

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
