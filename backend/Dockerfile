# Stage 1: Base image with Node.js
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Stage 2: Install dependencies
# Copy all package.json files and the lock file first
FROM base AS dependencies
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
# Install ALL dependencies for the monorepo
RUN npm install --omit=dev

# Stage 3: Build the backend application
# Copy the source code and use the installed node_modules
FROM base AS builder
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN npm run build --workspace=prodvor-backend

# Stage 4: Production image
# Copy only the necessary files from the builder stage
FROM base AS production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY backend/package.json ./backend/package.json

EXPOSE 3001
CMD ["node", "dist/main.js"]
