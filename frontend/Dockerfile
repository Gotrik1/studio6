# ---- Base Stage ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# ---- Dependencies Stage ----
FROM base AS deps
RUN npm install -g pnpm@10.13.1
RUN pnpm install --frozen-lockfile --prod=false

# ---- Builder Stage ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm@10.13.1
RUN pnpm --filter prodvor-frontend build

# ---- Runner Stage ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm@10.13.1

COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/frontend/public ./frontend/public

EXPOSE 9002

CMD ["pnpm", "--filter", "prodvor-frontend", "start"]
