FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy all package manifests and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies for the entire monorepo
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN pnpm --filter prodvor-backend prisma:generate

# Build the backend application
RUN pnpm --filter prodvor-backend build

# Add openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

EXPOSE 3001

CMD ["node", "backend/dist/main.js"]
