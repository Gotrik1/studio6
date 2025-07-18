#
# BASE
#
FROM node:20 as base
# Install OpenSSL, required by Prisma
RUN apt-get update && apt-get install -y openssl

#
# BUILDER
#
FROM base AS builder
WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace package.json files
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Copy Prisma schema
COPY backend/prisma ./backend/prisma

# Install dependencies and generate Prisma Client
# The 'postinstall' script for '@prisma/client' will run 'prisma generate'
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Explicitly generate prisma client just in case
RUN pnpm --filter prodvor-backend prisma:generate

# Copy the rest of the source code
COPY . .

# Build the backend
RUN pnpm --filter prodvor-backend build

#
# PRUNER - Create a production-only node_modules
#
FROM base AS pruner
WORKDIR /usr/src/app

RUN corepack enable

COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/

RUN pnpm deploy --legacy --prod --filter prodvor-backend /prod

#
# RUNNER - Final lightweight image
#
FROM node:20-alpine AS runner
WORKDIR /app

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl

ENV NODE_ENV production

# Copy pruned dependencies and build output
COPY --from=pruner /prod/backend ./backend
COPY --from=pruner /prod/node_modules ./node_modules

WORKDIR /app/backend

# Expose the port and start the app
EXPOSE 3001
CMD ["node", "dist/main"]
