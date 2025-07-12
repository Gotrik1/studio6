# 1. Builder stage: Install dependencies and build the backend app
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

ENV PATH="/usr/src/app/node_modules/.bin:$PATH"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter prodvor-backend prisma:generate
RUN pnpm --filter prodvor-backend build

# 2. Runner stage: Create a slim image for production
FROM node:20-alpine

WORKDIR /usr/src/app

# 👇 СТАВИМ pnpm на раннер-стадии!
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./backend/node_modules/.prisma

EXPOSE 3001

CMD ["node", "backend/dist/main"]
