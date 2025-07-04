# 1. Install dependencies
FROM node:20-slim AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --frozen-lockfile

# 2. Build the app
FROM node:20-slim AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
# Generate prisma client
RUN npx prisma generate
RUN npm run build

# 3. Production image
FROM node:20-slim AS runner
WORKDIR /usr/src/app
# Copy built app and production dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma
# Make sure to only install production dependencies
RUN npm ci --only=production

EXPOSE 3001
CMD ["node", "dist/main"]
