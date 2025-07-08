FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy all package manifests and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies for the entire monorepo
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the frontend application
RUN pnpm --filter prodvor-frontend build

ENV NODE_ENV production
EXPOSE 9002

CMD ["npm", "start", "--workspace=prodvor-frontend"]
