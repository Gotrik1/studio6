# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /usr/src/app
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
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=dependencies /usr/src/app/frontend/node_modules ./frontend/node_modules
RUN npm install -g pnpm@10.13.1
RUN pnpm --filter prodvor-backend prisma:generate
RUN pnpm --filter prodvor-backend build

# --- Runner Stage ---
FROM base AS runner
RUN npm install -g pnpm@10.13.1
COPY --from=builder /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# Убедимся, что Prisma Client есть в production-образе
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001
CMD ["pnpm", "start:backend"]
