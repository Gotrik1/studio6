# 1. Base stage for installing pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base AS dependencies
WORKDIR /usr/src/app
COPY pnpm-lock.yaml .
COPY package.json .
COPY pnpm-workspace.yaml .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
FROM base AS builder
WORKDIR /usr/src/app

# This is the crucial step that makes workspace binaries available.
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

COPY --from=dependencies /usr/src/app/ .
COPY backend/ ./backend/
COPY tsconfig.json .

# Generate Prisma client
RUN pnpm --filter prodvor-backend prisma:generate

# Build the backend
RUN pnpm --filter prodvor-backend build

# 4. Runner stage
FROM base AS runner
WORKDIR /usr/src/app

# Again, set the PATH to find node_modules binaries
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# Copy the generated Prisma client to the final image
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma
# An alternative and safer path for prisma client
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma


EXPOSE 3001
CMD ["pnpm", "start:backend"]
