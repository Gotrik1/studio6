# ---- Base Stage ----
FROM node:20 as base

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /usr/src/app

# Copy root manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace manifests
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install ALL dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the frontend application
RUN pnpm --filter prodvor-frontend build

# ---- Pruner Stage ----
FROM base as pruner
WORKDIR /usr/src/app

COPY pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Install only production dependencies
RUN corepack enable && \
    pnpm deploy --prod --filter prodvor-frontend ./frontend

# ---- Runner Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production dependencies and build artifacts
COPY --from=pruner /usr/src/app/frontend/node_modules ./node_modules
COPY --from=pruner /usr/src/app/frontend/.next ./.next
COPY --from=pruner /usr/src/app/frontend/public ./public
COPY --from=pruner /usr/src/app/frontend/package.json ./

# Expose the port the app runs on
EXPOSE 9002

# Set the command to run the application
CMD ["pnpm", "start"]
