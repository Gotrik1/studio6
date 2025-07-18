# ---- Base Stage ----
FROM node:20 as base
# No specific system dependencies needed for the frontend base

# ---- Builder Stage ----
FROM base as builder
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace-specific manifests
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install ALL dependencies (including dev)
RUN corepack enable && pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the frontend application
RUN pnpm --filter prodvor-frontend build

# ---- Pruner Stage ----
# This stage creates a lean node_modules with only production dependencies
FROM base as pruner
WORKDIR /usr/src/app

RUN corepack enable

COPY pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

# Deploy to /prod/frontend to create the correct directory structure
RUN pnpm deploy --legacy --prod --filter prodvor-frontend /prod/frontend

# ---- Runner Stage ----
# This is the final, lightweight image
FROM node:20-alpine as runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production dependencies and compiled code from the pruner stage
COPY --from=pruner /prod .

# The WORKDIR is already /app, and the deploy command puts the frontend files in ./frontend
WORKDIR /app/frontend

# The start script is defined in the root package.json, so we need pnpm to run it.
# We'll install only pnpm itself for the runner.
RUN npm install -g pnpm

CMD ["pnpm", "start"]
