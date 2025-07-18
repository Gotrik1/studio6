# ---- Base Stage ----
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /usr/src/app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma

# Install dependencies and generate Prisma Client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the backend application
RUN pnpm --filter prodvor-backend build

# ---- Pruner Stage (for production dependencies only) ----
FROM base AS pruner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/

# Create production node_modules
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && \
    pnpm deploy --prod --filter prodvor-backend ./backend

# ---- Runner Stage (final, lightweight image) ----
FROM node:20-alpine as runner
WORKDIR /app

# Install openssl for runtime
RUN apk add --no-cache openssl

# Copy artifacts from the pruner stage
COPY --from=pruner /usr/src/app/backend/dist ./dist
COPY --from=pruner /usr/src/app/backend/node_modules ./node_modules

# Expose the application port
EXPOSE 3001

# The command to run the application
CMD ["node", "dist/main.js"]
