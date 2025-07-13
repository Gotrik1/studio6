# Frontend Dockerfile

# --- 1. Builder Stage ---
# This stage installs dependencies, builds the frontend, and prepares production assets.
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Set PATH to include pnpm's bin directory. Critical for finding commands like 'next'.
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

# Copy package manager configs first to leverage Docker cache
# This layer only gets rebuilt if these files change.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy package.json files for each workspace
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install all dependencies for all workspaces
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the frontend application
RUN pnpm --filter prodvor-frontend build


# --- 2. Runner Stage ---
# This stage creates the final, lean image for running the application.
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Set PATH to include pnpm's bin directory for running 'next'
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
ENV NODE_ENV=production

# Copy only the production-relevant files from the builder stage
COPY --from=builder /usr/src/app/frontend/.next ./frontend/.next
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/next.config.mjs ./frontend/next.config.mjs
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/package.json

# Expose the port Next.js runs on
EXPOSE 9002

# The command to start the Next.js server in production mode
# Since we are in a pnpm workspace, we still need to filter.
# `pnpm --filter prodvor-frontend start` will execute `next start -p 9002`
# as defined in frontend/package.json
CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
