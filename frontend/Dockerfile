# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy all package manifests first to leverage Docker caching
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build --workspace=prodvor-frontend

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app/frontend

ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/node_modules ../node_modules
COPY --from=builder /app/package.json ../package.json
COPY --from=builder /app/frontend/package.json ./package.json

COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/next.config.ts ./next.config.ts
COPY --from=builder /app/frontend/tailwind.config.ts ./tailwind.config.ts
COPY --from=builder /app/frontend/postcss.config.cjs ./postcss.config.cjs

EXPOSE 9002
ENV PORT 9002

CMD ["npm", "start", "--workspace=prodvor-frontend"]
