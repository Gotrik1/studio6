
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install dependencies first, in a separate step
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN apk add --no-cache openssl
RUN npx prisma generate

EXPOSE 3001
CMD ["npm", "run", "start"]
