# 1. Base stage
FROM node:20-alpine as base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base as dependencies
WORKDIR /app

COPY pnpm-lock.yaml .
COPY package.json .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# This is the crucial step for monorepo installs.
# It ensures all workspace dependencies are installed correctly.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
FROM base as builder
WORKDIR /app

# This is the crucial step to make sure executables are found.
ENV PATH="/app/node_modules/.bin:$PATH"

COPY --from=dependencies /app/ .
COPY frontend/ ./frontend/

RUN pnpm --filter prodvor-frontend build

# 4. Runner stage
FROM base as runner
WORKDIR /app

# This is the crucial step to make sure executables are found.
ENV PATH="/app/node_modules/.bin:$PATH"

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package.json ./frontend/package.json
COPY --from=builder /app/package.json .

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
