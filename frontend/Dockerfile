# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all package manifests first to leverage Docker caching
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies for all workspaces
RUN npm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build --workspace=prodvor-frontend


# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/frontend/package.json ./frontend/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/next.config.ts ./frontend/
COPY --from=builder /app/postcss.config.cjs ./
COPY --from=builder /app/tailwind.config.ts ./

EXPOSE 9002
ENV PORT 9002

CMD ["npm", "start", "--workspace=prodvor-frontend"]
