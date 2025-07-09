# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy all package manifests first to leverage Docker caching
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma/schema.prisma ./backend/prisma/

# Install dependencies for the entire monorepo
RUN npm install --frozen-lockfile

# Generate Prisma Client explicitly after installation
RUN npx prisma generate --schema=./backend/prisma/schema.prisma

# Copy the rest of the source code
COPY . .

# Build the NestJS app
RUN npm run build --workspace=prodvor-backend

# Prune development dependencies
RUN npm prune --production --workspace=prodvor-backend

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

# Set the working directory for the backend
WORKDIR /usr/src/app/backend

EXPOSE 3001
ENV PORT 3001

# Run the production server
CMD ["node", "dist/main"]
