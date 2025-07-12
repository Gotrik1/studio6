# ---- Base ----
# Use a specific Node.js version for consistency
FROM node:20-alpine AS base

# ---- Dependencies ----
# Install all dependencies, including devDependencies for the build step
FROM base AS dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
# Note: We are now installing ALL dependencies, not just production ones
# This is necessary for the build step which requires @nestjs/cli
RUN npm install --workspace=prodvor-backend

# ---- Build ----
# Build the application
FROM dependencies AS build
WORKDIR /usr/src/app
COPY . .
RUN npm run build --workspace=prodvor-backend

# ---- Runner ----
# Final, smaller image for running the application
FROM base AS runner
WORKDIR /usr/src/app

# Set the PATH to include node_modules/.bin to find the nest command
ENV PATH /usr/src/app/backend/node_modules/.bin:$PATH

# Copy only necessary files from previous stages
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/backend/package.json ./backend/
COPY --from=build /usr/src/app/backend/node_modules ./backend/node_modules

# The command to run the application (start:dev needs devDependencies)
CMD ["npm", "run", "start:dev", "--workspace=prodvor-backend"]
