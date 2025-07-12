# 1. Builder stage: Install dependencies and build the backend app
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Add pnpm binaries to PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Copy manifest files for dependency installation (cache efficient)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install ALL dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN pnpm --filter prodvor-backend prisma:generate

# Build the backend application
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Create a slim image for production
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy manifest files for installing only production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Install ONLY production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built backend code from builder stage
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Copy Prisma schema for migrations (if needed in CI/CD)
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Copy generated Prisma client for runtime
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

EXPOSE 3001

CMD ["node", "backend/dist/main"]
