# 1. Base stage with Node.js and system dependencies
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

# Set working directory
WORKDIR /usr/src/app

# 2. Builder stage: Install all dependencies and build the app
FROM base as builder
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter prodvor-frontend build

# 3. Pruner stage: Install only production dependencies
FROM base as pruner
RUN corepack enable
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# 4. Runner stage: Create the final, lightweight image
FROM node:20-alpine as runner
WORKDIR /app
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=pruner /usr/src/app/frontend/node_modules ./frontend/node_modules
COPY --from=pruner /usr/src/app/frontend/package.json ./frontend/package.json
COPY --from=pruner /usr/src/app/frontend/.next ./frontend/.next
COPY --from=pruner /usr/src/app/frontend/public ./frontend/public
EXPOSE 9002
CMD ["pnpm", "start:frontend"]
