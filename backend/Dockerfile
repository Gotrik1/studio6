# ---- Base Stage: Common setup for builder and pruner ----
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

# ---- Builder Stage: Build the application ----
FROM base as builder
WORKDIR /usr/src/app

# Copy manifest files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace-specific package.json
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Copy prisma schema
COPY backend/prisma ./backend/prisma

# Enable pnpm and install dependencies
# This step will also trigger `prisma generate` due to the postinstall script
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
RUN pnpm --filter prodvor-backend build

# ---- Pruner Stage: Create production-only node_modules ----
FROM base as pruner
WORKDIR /usr/src/app

# Enable pnpm
RUN corepack enable

# Copy necessary files for deployment
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --prod --filter prodvor-backend ./backend

# ---- Runner Stage: Final lightweight image ----
FROM node:20-alpine as runner
WORKDIR /app

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Copy artifacts from pruner
COPY --from=pruner /usr/src/app/backend ./backend
COPY --from=pruner /usr/src/app/node_modules ./node_modules

# Expose port and start the application
EXPOSE 3001
CMD ["node", "backend/dist/main.js"]
