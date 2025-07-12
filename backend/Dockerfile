# Stage 1: Install dependencies
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

# Copy all package.json files from the monorepo root and workspaces
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies (including devDependencies for the build step)
RUN npm install

# Stage 2: Build the backend application
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy all source files for the entire monorepo
COPY . .

# Copy the installed node_modules from the 'dependencies' stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Generate the Prisma client based on the schema
RUN npm run prisma:generate --workspace=prodvor-backend

# Build the NestJS application
RUN npm run build --workspace=prodvor-backend

# Stage 3: Create the final production image
FROM node:20-alpine as runner
WORKDIR /usr/src/app

# Copy the built application from the 'builder' stage
# The output is in /backend/dist, so we copy from there.
COPY --from=builder /usr/src/app/backend/dist ./dist

# Copy production dependencies definition
COPY package.json ./
COPY backend/package.json ./backend/

# Install only production dependencies
RUN npm install --omit=dev

# Copy prisma schema and client for runtime
COPY --from=builder /usr/src/app/backend/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./.prisma

CMD ["node", "dist/main"]
