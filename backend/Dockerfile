# Stage 1: Build the application
FROM node:20-alpine AS builder

# Install OpenSSL, a dependency for Prisma Client
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN npm install -g pnpm
RUN pnpm install

COPY backend/ ./backend/
COPY prisma/ ./prisma/

WORKDIR /usr/src/app/backend

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine

# Install OpenSSL for Prisma Client runtime
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

# Copy built application and necessary files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./package.json
# Copy Prisma schema and generated client for runtime
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma


# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node", "dist/main"]
