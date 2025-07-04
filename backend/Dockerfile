# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
# Using --legacy-peer-deps for compatibility if needed, but will try without first
RUN npm install

# Bundle app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# The command to run the app will be specified in docker-compose.yml
# For production, this would typically be: CMD [ "npm", "run", "start:prod" ]
# For development, we'll use the command in docker-compose to enable hot-reloading.
