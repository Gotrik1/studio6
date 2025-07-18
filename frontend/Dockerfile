#
# BASE
#
FROM node:20 as base
RUN apt-get update && apt-get install -y openssl

#
# BUILDER
#
FROM base as builder
WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace package.json files
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

COPY backend/prisma ./backend/prisma

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm --filter prodvor-backend prisma:generate

COPY . .

RUN pnpm --filter prodvor-frontend build

#
# PRUNER
#
FROM base as pruner
WORKDIR /usr/src/app

RUN corepack enable

COPY --from=builder /usr/src/app/frontend/dist ./frontend/dist
COPY --from=builder /usr/src/app/frontend/public ./frontend/public
COPY --from=builder /usr/src/app/frontend/.next/standalone ./frontend/
COPY --from=builder /usr/src/app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/frontend/package.json ./frontend/

RUN pnpm deploy --legacy --prod --filter prodvor-frontend /prod

#
# RUNNER
#
FROM node:20-alpine as runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV production

COPY --from=pruner /prod/frontend ./frontend
COPY --from=pruner /prod/node_modules ./node_modules

WORKDIR /app/frontend

CMD ["node", "server.js"]
