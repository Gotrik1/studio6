# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy all package manifests first to leverage Docker caching
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the NestJS app
RUN npm run build --workspace=prodvor-backend

# Stage 2: Production
FROM node:20-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy only necessary artifacts from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

# Prisma generate is needed for the production container
RUN npm run prisma:generate --workspace=prodvor-backend

EXPOSE 3001
CMD [ "npm", "run", "start:prod", "--workspace=prodvor-backend" ]
