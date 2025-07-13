# 1. Builder stage: Install dependencies, build the app
FROM node:20-slim AS builder
WORKDIR /usr/src/app

# Enable corepack for pnpm management
RUN corepack enable

# Copy only necessary files to leverage Docker cache for dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies for the monorepo
# --frozen-lockfile ensures we use the exact versions from the lockfile
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Set the PATH to include node_modules/.bin for this and subsequent commands
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# --- DEBUGGING PRISMA ---
# Проверим, что prisma установлен и доступен через pnpm
RUN pnpm --filter prodvor-backend exec prisma --version
# Проверим содержимое prisma директории
RUN ls -la /usr/src/app/backend/prisma/
# --- END DEBUGGING ---

# Generate Prisma client based on the schema
# This needs to run *before* the build to ensure types are available
RUN pnpm --filter prodvor-backend prisma:generate --verbose

# --- DEBUGGING PRISMA (POST-GENERATION) ---
# Проверим, что создалось после генерации
RUN ls -la /usr/src/app/backend/node_modules/ | grep prisma
RUN ls -la /usr/src/app/backend/node_modules/.prisma/ || echo "No .prisma directory found"
# --- END DEBUGGING ---


# Build the NestJS application
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Create a slim image for production
FROM node:20-slim AS runner
WORKDIR /usr/src/app

# Enable corepack for pnpm management
RUN corepack enable

# Copy necessary files for production installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy build artifacts and necessary files from the builder stage
# Copy the compiled application code
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
# Copy the prisma schema required for migrations
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma
# Copy the generated Prisma client
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Expose the port the app runs on
EXPOSE 3001

# The command to run the application
CMD ["pnpm", "start:backend"]
