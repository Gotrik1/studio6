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
RUN npm run build

# 3. Production image
FROM node:20-slim AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
# This will be the user that runs the app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built app from the builder stage
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Change ownership to the new user
USER nextjs
# Set the exposed port, this can be overwritten by the PORT environment variable
EXPOSE 9002
# Start the app
CMD ["npm", "start", "--", "-p", "9002"]
