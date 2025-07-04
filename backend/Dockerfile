# Dockerfile for NestJS backend
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
# Use --legacy-peer-deps to avoid issues with dependency resolution
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
# Use --legacy-peer-deps to avoid issues with dependency resolution
RUN npm install --only=production --legacy-peer-deps

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

CMD ["node", "dist/main"]
