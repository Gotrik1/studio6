FROM node:20-alpine

WORKDIR /usr/src/app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3001

CMD [ "npm", "run", "start:prod" ]

    