# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy all package manifests first to leverage Docker caching
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Copy prisma schema before installing dependencies
COPY backend/prisma ./backend/prisma/

# Install all dependencies for the monorepo
RUN npm install --frozen-lockfile

# Copy the rest of the backend source code
COPY backend/ ./backend/

# Build the NestJS app, which now includes prisma generate
RUN npm run build:docker --workspace=prodvor-backend

# Stage 2: Create the production image
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

# The command to run the application
EXPOSE 3001
CMD [ "npm", "run", "start:prod", "--workspace=prodvor-backend" ]
