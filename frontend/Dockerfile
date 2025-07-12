# 1. Base stage
FROM docker.io/library/node:20-alpine as base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base as dependencies
WORKDIR /app
COPY pnpm-lock.yaml .
COPY package.json .
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
FROM base as builder
WORKDIR /app
# Add the node_modules/.bin to the PATH
ENV PATH="/app/node_modules/.bin:$PATH"
COPY --from=dependencies /app/ .
COPY frontend/ ./frontend/
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.mjs .
COPY next.config.mjs .
RUN pnpm --filter prodvor-frontend build

# 4. Runner stage
FROM base as runner
WORKDIR /app
# Add the node_modules/.bin to the PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json .
COPY --from=dependencies /app/frontend/package.json ./frontend/

# Copy built app
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
