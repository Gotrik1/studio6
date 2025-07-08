# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# If you have pnpm-lock.yaml in the root, copy it
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source files
COPY backend/ ./backend/
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Build the NestJS application
RUN pnpm --filter prodvor-backend build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /usr/src/app

# Install production dependencies only
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY package.json ./
COPY backend/package.json ./backend/

# Copy built application
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Add OpenSSL for Prisma's requirement
RUN apk add --no-cache openssl

EXPOSE 3001

# The command to run the application will be specified in docker-compose.yml
# CMD ["node", "backend/dist/main"]
