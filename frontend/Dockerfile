
# /frontend/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm install

# Copy source code
COPY frontend/ ./frontend/

# Copy root configs
COPY tailwind.config.ts postcss.config.cjs tsconfig.json ./

# Build the Next.js app
RUN npm run build --workspace=prodvor-frontend

# Production image
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=base /app/frontend/.next ./frontend/.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/frontend/package.json ./frontend/package.json
COPY --from=base /app/frontend/public ./frontend/public

EXPOSE 9002
CMD ["npm", "start", "--workspace=prodvor-frontend"]
