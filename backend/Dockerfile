# 1. Builder Stage: Build the application
FROM node:20 as builder
WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable

# Copy manifests and prisma schema first for caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

# Install all dependencies (including dev)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Copy the rest of the source code
COPY . .

# Build the application
RUN pnpm --filter prodvor-backend build

# 2. Pruner Stage: Create production-only node_modules
FROM node:20 as pruner
WORKDIR /app

# Install pnpm
RUN corepack enable

# Copy manifests
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Copy the generated Prisma Client from the builder stage
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Install only production dependencies, ignoring scripts like prisma:generate
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

# 3. Runner Stage: Create the final lightweight image
FROM node:20-alpine as runner
WORKDIR /app

# Install required system dependencies for Prisma
RUN apk add --no-cache openssl

# Copy production node_modules and built code from pruner and builder
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Expose the port the app runs on
EXPOSE 3001

# Run the application
CMD ["node", "backend/dist/main.js"]
