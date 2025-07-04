# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Prisma ----
FROM base as prisma-generator
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY prisma ./prisma
RUN npx prisma generate

# ---- Runner ----
FROM base AS runner
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=prisma-generator /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/package.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
