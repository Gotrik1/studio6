# ---- Base Stage ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# ---- Dependencies Stage ----
FROM base AS deps
RUN npm install -g pnpm@10.13.1
RUN pnpm install --frozen-lockfile --prod=false

# ---- Builder Stage ----
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm@10.13.1
RUN pnpm --filter prodvor-backend prisma:generate
RUN pnpm --filter prodvor-backend build

# ---- Runner Stage ----
FROM base AS runner
RUN npm install -g pnpm@10.13.1
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma
COPY --from=builder /usr/src/app/backend/package.json ./backend/
# The command to run the application is now in the docker-compose file
EXPOSE 3001
CMD ["pnpm", "--filter", "prodvor-backend", "start:prod"]
