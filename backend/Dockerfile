# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install necessary system dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy all package manifests first to leverage Docker caching
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies for the monorepo
RUN npm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Generate Prisma Client (now that schema is copied)
RUN npx prisma generate --schema=./backend/prisma/schema.prisma

# Build the backend
RUN npm run build --workspace=prodvor-backend

# Stage 2: Production Runner
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Install necessary system dependencies for Prisma runtime
RUN apk add --no-cache openssl libc6-compat

# Copy built assets and necessary node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

# Expose port and start the app
EXPOSE 3001
ENV PORT 3001
CMD ["npm", "run", "start:prod", "--workspace=prodvor-backend"]
