# === Stage 1: Builder ===
# This stage builds the application and generates the Prisma client.
# It installs all dependencies, including devDependencies.
FROM node:20 AS builder
WORKDIR /usr/src/app

# Copy manifests first to leverage Docker cache for dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Copy Prisma schema before installing dependencies
COPY backend/prisma ./backend/prisma

# Enable pnpm and install all dependencies
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Generate Prisma Client
# This requires devDependencies (the `prisma` CLI)
RUN pnpm --filter prodvor-backend prisma:generate

# Copy the rest of the source code
COPY . .

# Build the application
RUN pnpm --filter prodvor-backend build


# === Stage 2: Pruner ===
# This stage creates a lean production-ready set of dependencies.
# It does NOT use pnpm deploy, but rather a more robust method of
# copying build artifacts and then installing only production dependencies.
FROM node:20 AS pruner
WORKDIR /usr/src/app

# Enable pnpm
RUN corepack enable

# Copy only necessary package manifests
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/

# Copy the built application from the 'builder' stage
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Copy the generated Prisma client from the 'builder' stage
# This is crucial for the production image to work without devDependencies
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Install only production dependencies, skipping postinstall scripts
RUN pnpm install --prod --ignore-scripts

# === Stage 3: Runner ===
# This is the final, lightweight production image.
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Copy all production-ready files from the 'pruner' stage
COPY --from=pruner /usr/src/app/ ./

# Expose the application port
EXPOSE 3001

# The command to run the application
CMD ["node", "backend/dist/main"]
