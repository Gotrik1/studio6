# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY frontend/package.json ./frontend/
# If you have pnpm-lock.yaml in the root, copy it
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source files
COPY frontend/ ./frontend/

# Set the build-time environment variable
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Build the Next.js application
RUN pnpm --filter prodvor-frontend build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules
COPY package.json ./
COPY frontend/package.json ./frontend/

# Copy built application
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

# Expose the port the app runs on
EXPOSE 9002

# The command to run the application will be specified in docker-compose.yml
# CMD ["npm", "start", "--workspace=prodvor-frontend"]
