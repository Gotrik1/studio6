# ---- Base Stage ----
FROM node:20 as base

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /usr/src/app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the frontend application
RUN pnpm --filter prodvor-frontend build

# ---- Pruner Stage (for production dependencies only) ----
FROM base AS pruner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/next.config.js ./frontend/

# Create production node_modules
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm deploy --prod --filter prodvor-frontend ./frontend

# ---- Runner Stage (final, lightweight image) ----
FROM node:20-alpine as runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the pruned dependencies and built app
COPY --from=pruner /usr/src/app/frontend/package.json ./package.json
COPY --from=pruner /usr/src/app/frontend/node_modules ./node_modules
COPY --from=pruner /usr/src/app/frontend/public ./public
COPY --from=pruner /usr/src/app/frontend/.next ./.next

# Expose the application port
EXPOSE 9002

# The command to run the application
CMD ["pnpm", "start"]
