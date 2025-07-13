# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# --- Dependencies Stage ---
FROM base AS dependencies
RUN npm install -g pnpm@10.13.1
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile

# --- Builder Stage ---
FROM base AS builder
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/frontend/node_modules ./frontend/node_modules
COPY --from=dependencies /app/backend/node_modules ./backend/node_modules
RUN npm install -g pnpm@10.13.1
RUN pnpm --filter prodvor-frontend build

# --- Runner Stage ---
FROM base AS runner
RUN npm install -g pnpm@10.13.1
ENV NODE_ENV production

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules

EXPOSE 9002
CMD ["pnpm", "start:frontend"]
