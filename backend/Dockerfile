# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all package manifests first to leverage Docker caching
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Copy Prisma schema BEFORE installing dependencies
# This is crucial for the `postinstall` script `prisma generate`
COPY backend/prisma/schema.prisma ./backend/prisma/

RUN npm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the NestJS app
RUN npm run build --workspace=prodvor-backend

# Prune development dependencies
RUN npm prune --production

# Stage 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

# Expose the port the app runs on
EXPOSE 3001

# The command to run the application
CMD ["node", "backend/dist/main"]
