# 1. Base stage with Node.js and system dependencies
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

# Set working directory
WORKDIR /usr/src/app

# 2. Builder stage: Install all dependencies, generate code, and build the app
FROM base as builder
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY backend/prisma ./backend/prisma
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter prodvor-backend build

# 3. Pruner stage: Install only production dependencies
FROM base as pruner
RUN corepack enable
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# 4. Runner stage: Create the final, lightweight image
FROM node:20-alpine as runner
WORKDIR /app
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=pruner /usr/src/app/backend/package.json ./backend/package.json
COPY --from=pruner /usr/src/app/backend/dist ./backend/dist
COPY backend/prisma ./backend/prisma
EXPOSE 3001
CMD ["node", "backend/dist/main"]
