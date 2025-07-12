# Stage 1: Base image with Node.js
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Stage 2: Install all dependencies (including devDependencies)
FROM base AS dependencies
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm install

# Stage 3: Build the backend application
FROM base AS builder
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN npm run prisma:generate --workspace=prodvor-backend
RUN npm run build --workspace=prodvor-backend

# Stage 4: Production image with only necessary files
FROM base as runner
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./.prisma
COPY --from=builder /usr/src/app/backend/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /usr/src/app/package.json \
     --from=builder /usr/src/app/backend/package.json \
     ./

# Install only production dependencies
RUN npm install --omit=dev

CMD ["node", "dist/main"]
