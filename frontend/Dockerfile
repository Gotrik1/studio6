# 1. Base stage for installing pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base AS dependencies
WORKDIR /app
COPY pnpm-lock.yaml .
COPY package.json .
COPY pnpm-workspace.yaml .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
FROM base AS builder
WORKDIR /app

# This is the crucial step that makes workspace binaries available.
ENV PATH="/app/node_modules/.bin:$PATH"

COPY --from=dependencies /app/ .
COPY frontend/ .
COPY tsconfig.json .

# Build the frontend
RUN pnpm --filter prodvor-frontend build

# 4. Runner stage
FROM base AS runner
WORKDIR /app

# Set user and create necessary directories
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/frontend/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/public ./public

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
