# ---- Base Stage: Common setup ----
FROM node:20 as base

# ---- Builder Stage: Build the application ----
FROM base as builder
WORKDIR /usr/src/app

# Copy manifest files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace-specific package.json
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Enable pnpm and install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
RUN pnpm --filter prodvor-frontend build

# ---- Pruner Stage: Create production-only node_modules ----
FROM base as pruner
WORKDIR /usr/src/app

# Enable pnpm
RUN corepack enable

# Copy necessary files for deployment
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-frontend ./frontend

# ---- Runner Stage: Final lightweight image ----
FROM node:20-alpine as runner
WORKDIR /app

ENV NODE_ENV=production

# Copy artifacts from pruner
COPY --from=pruner /usr/src/app/frontend ./frontend
COPY --from=pruner /usr/src/app/node_modules ./node_modules

# Expose port and start the application
EXPOSE 9002
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
