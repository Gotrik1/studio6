# Stage 1: Install dependencies
FROM node:20-alpine AS dependencies

WORKDIR /usr/src/app

# Copy all package.json and package-lock.json files
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all dependencies (including devDependencies for the build stage)
RUN npm install

# Stage 2: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy all source code
COPY . .

# Copy node_modules from the dependencies stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Generate Prisma Client
RUN npm run prisma:generate --workspace=prodvor-backend

# Build the specific backend workspace
RUN npm run build --workspace=prodvor-backend

# Stage 3: Setup production dependencies
FROM node:20-alpine as prod-dependencies

WORKDIR /usr/src/app

# Copy all package.json and package-lock.json files
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install only production dependencies
RUN npm install --omit=dev


# Stage 4: Create the final, lean production image
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copy production node_modules from the prod-dependencies stage
COPY --from=prod-dependencies /usr/src/app/node_modules ./node_modules

# Copy Prisma Client and schema
COPY --from=builder /usr/src/app/node_modules/.prisma ./.prisma
COPY --from=builder /usr/src/app/backend/prisma/schema.prisma ./prisma/schema.prisma

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/backend/dist ./dist

# Copy package.json files needed for runtime
COPY package.json ./
COPY backend/package.json ./backend/

# The command to run the application
CMD ["node", "dist/main.js"]
