FROM node:20-alpine AS base
# Install openssl for Prisma
RUN apk add --no-cache openssl
WORKDIR /usr/src/app

FROM base AS deps
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm fetch

FROM base AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm i --offline
RUN pnpm --filter prodvor-backend run prisma:generate
RUN pnpm --filter prodvor-backend run build

FROM base as runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main.js"]
