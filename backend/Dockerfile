# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install openssl for prisma
RUN apk add --no-cache openssl

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Your app binds to port 3001, so you need to expose it
EXPOSE 3001

# Define the command to run your app
CMD ["npm", "run", "start:prod"]
