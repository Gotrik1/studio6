
# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Add openssl for prisma, which is a common requirement on Alpine
RUN apk add --no-cache openssl

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the root package.json and the lock file
# Using a wildcard for package-lock.json to avoid errors if it doesn't exist
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml ./

# Copy workspace package.json files
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies for the entire monorepo
# This leverages npm's workspace capabilities
RUN npm install

# Copy the rest of the backend source code
COPY backend/ ./backend/

# Build the backend application
RUN npm run build --workspace=prodvor-backend

# Expose the port the app runs on
EXPOSE 3001

# Default command for production, will be overridden by docker-compose in dev
CMD ["node", "backend/dist/main.js"]
