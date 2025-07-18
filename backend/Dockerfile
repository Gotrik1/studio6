# === BASE STAGE ===
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl
WORKDIR /usr/src/app
RUN corepack enable

# === BUILDER STAGE ===
FROM base as builder

# 1. Copy only manifest files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# 2. Copy Prisma schema before installing dependencies
COPY backend/prisma ./backend/prisma

# 3. Install ALL dependencies (including dev) to run build and generate prisma client
# This step also runs the `postinstall` script which runs `prisma generate`
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 4. Copy the rest of the source code
COPY . .

# 5. Build the application
RUN pnpm --filter prodvor-backend build

# === PRUNER STAGE ===
# Install only production dependencies
FROM base as pruner
WORKDIR /prod

# Copy only the necessary files for deployment
COPY pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json

# Deploy production dependencies into a clean subdirectory
RUN pnpm deploy --legacy --prod --filter prodvor-backend ./backend

# Copy the compiled output from the builder stage
COPY --from=builder /usr/src/app/backend/dist ./backend/dist


# === RUNNER STAGE ===
# Final, small production image
FROM node:20-alpine as runner
WORKDIR /app

# Copy the pruned dependencies and the compiled code
COPY --from=pruner /prod .

# Expose port and run the application
EXPOSE 3001
CMD [ "node", "backend/dist/main" ]
