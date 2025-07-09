# 1. Base Image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install pnpm
RUN npm install -g pnpm

# 4. Copy all package manifests and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# 5. Install dependencies
RUN pnpm install

# 6. Copy the rest of the source code
COPY . .

# 7. Build the frontend application
RUN pnpm --filter prodvor-frontend build

# 8. Expose port and set default command
EXPOSE 9002
CMD ["npm", "start", "--workspace=prodvor-frontend"]
