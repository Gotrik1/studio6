# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
COPY pnpm-lock.yaml .
COPY package.json .
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/frontend/node_modules ./frontend/node_modules
COPY frontend/ ./frontend/
COPY tsconfig.json .
COPY tailwind.config.ts .
RUN pnpm --filter prodvor-frontend build

# ---- Runner ----
FROM base AS runner
ENV NODE_ENV production
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package.json ./frontend/package.json
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static

EXPOSE 9002
CMD ["node", "frontend/server.js"]
