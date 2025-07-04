# Dockerfile for Next.js frontend
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Use --legacy-peer-deps to avoid issues with dependency resolution
RUN npm install --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

EXPOSE 9002

CMD ["npm", "run", "start"]
