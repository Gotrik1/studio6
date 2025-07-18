# 1. Builder Stage: Build the application
FROM node:20 as builder
WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable

# Copy manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies (including dev)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
RUN pnpm --filter prodvor-frontend build

# 2. Pruner Stage: Create production-only node_modules
FROM node:20 as pruner
WORKDIR /app

# Install pnpm
RUN corepack enable

# Copy manifests
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# 3. Runner Stage: Create the final lightweight image
FROM node:20-alpine as runner
WORKDIR /app

# Set user and group for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Copy production node_modules and built code from pruner and builder
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=pruner /app/frontend/package.json ./frontend/
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Expose the port the app runs on
EXPOSE 9002

# Set the host to 0.0.0.0 to be reachable from outside the container
ENV HOSTNAME 0.0.0.0

# Run the application
CMD ["pnpm", "start:frontend"]
