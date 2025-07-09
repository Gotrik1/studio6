# Dockerfile for the Next.js frontend application

# Use the official Node.js 20 image as a parent image
FROM node:20-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Copy root package.json and lockfile
COPY package.json package-lock.json* ./

# Copy workspaces package.json files
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies for the entire monorepo
RUN npm install

# Copy the rest of the backend code
COPY backend ./backend

# Copy the rest of the frontend code
COPY frontend ./frontend

# Copy configuration files from the root to the app directory
COPY tailwind.config.ts postcss.config.cjs tsconfig.json ./

# Set NEXT_TELEMETRY_DISABLED to 1 to disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application for production
RUN npm run build --workspace=prodvor-frontend

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built assets from the previous stage
COPY --from=base /app/frontend/.next ./frontend/.next
COPY --from=base /app/frontend/public ./frontend/public
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/frontend/package.json ./frontend/package.json
COPY --from=base /app/frontend/next.config.ts ./frontend/

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT=9002

EXPOSE 9002

CMD ["npm", "start", "--workspace=prodvor-frontend"]