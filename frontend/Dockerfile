# === Stage 1: Builder ===
# This stage installs all dependencies (dev and prod) and builds the Next.js application.
FROM node:20 AS builder
WORKDIR /usr/src/app

# Copy manifests first to leverage Docker cache for dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Enable pnpm and install all dependencies
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Next.js application
RUN pnpm --filter prodvor-frontend build

# === Stage 2: Pruner ===
# This stage prunes the node_modules to only include production dependencies.
FROM node:20 AS pruner
WORKDIR /usr/src/app

# Enable pnpm
RUN corepack enable

# Copy only necessary package manifests
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Copy the built application artifacts from the 'builder' stage
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Install only production dependencies
# --ignore-scripts is not strictly necessary here but is good practice
RUN pnpm install --prod --ignore-scripts

# === Stage 3: Runner ===
# This is the final, lightweight production image.
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Set environment to production
ENV NODE_ENV=production

# Copy all production-ready files from the 'pruner' stage
COPY --from=pruner /usr/src/app/ ./

# Expose the application port
EXPOSE 9002

# The command to run the application
CMD ["pnpm", "start:frontend"]
