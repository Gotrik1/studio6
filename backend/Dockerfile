# 1. Base stage
FROM node:20-alpine as base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base as dependencies
WORKDIR /usr/src/app

COPY pnpm-lock.yaml .
COPY package.json .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# This is the crucial step for monorepo installs.
# It ensures all workspace dependencies are installed correctly.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


# 3. Builder stage
FROM base as builder
WORKDIR /usr/src/app

# This is the crucial step to make sure executables are found.
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Copy dependencies and source code
COPY --from=dependencies /usr/src/app/ .
COPY backend/ ./backend/
COPY backend/prisma/ ./prisma/
COPY tsconfig.json .

# Build the backend
RUN pnpm --filter prodvor-backend build

# 4. Runner stage
FROM base as runner
WORKDIR /usr/src/app

# This is the crucial step to make sure executables are found.
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/package.json .

# Prisma client needs to be available in the final image
COPY --from=builder /usr/src/app/backend/prisma/schema.prisma ./backend/prisma/schema.prisma

EXPOSE 3001
CMD ["pnpm", "start:backend"]
