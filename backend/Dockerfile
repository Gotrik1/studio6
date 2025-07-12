# 1. Base stage
FROM docker.io/library/node:20-alpine as base
RUN npm install -g pnpm

# 2. Dependencies stage
FROM base as dependencies
WORKDIR /usr/src/app
COPY pnpm-lock.yaml .
COPY package.json .
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. Builder stage
FROM base as builder
WORKDIR /usr/src/app
# Add the node_modules/.bin to the PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
COPY --from=dependencies /usr/src/app/ .
COPY backend/ ./backend/
COPY tsconfig.json .

# Generate Prisma Client
RUN pnpm --filter prodvor-backend prisma:generate

# Build the backend
RUN pnpm --filter prodvor-backend build

# 4. Runner stage
FROM base as runner
WORKDIR /usr/src/app
# Add the node_modules/.bin to the PATH
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
COPY --from=builder /usr/src/app/dist ./dist
# Copy production dependencies from the dependencies stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package.json .
COPY --from=dependencies /usr/src/app/backend/package.json ./backend/
# The Prisma client is needed at runtime
COPY --from=builder /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
EXPOSE 3001
CMD [ "pnpm", "start:backend" ]
