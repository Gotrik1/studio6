# 1. Base Image
FROM node:20-alpine

# Install dependencies needed for Prisma
RUN apk add --no-cache openssl

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Install pnpm
RUN npm install -g pnpm

# 4. Copy all package manifests and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# 5. Install dependencies for the entire workspace
RUN pnpm install

# 6. Copy the rest of the source code
COPY . .

# 7. Build the backend application
RUN pnpm --filter prodvor-backend build

# 8. Set the default command to run the app in production
# This will be overridden by docker-compose.yml, but is good practice.
CMD ["npm", "run", "start:prod", "--workspace=prodvor-backend"]
