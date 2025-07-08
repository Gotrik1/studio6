
# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the root package.json and lock files
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml ./

# Copy workspace package.json files and configs
# We copy backend's package.json as well to satisfy workspace dependencies
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY frontend/next.config.ts ./frontend/
COPY frontend/tailwind.config.ts ./frontend/
COPY frontend/postcss.config.js ./frontend/
COPY frontend/components.json ./frontend/
COPY frontend/tsconfig.json ./frontend/
COPY frontend/.eslintrc.json ./frontend/

# Install all monorepo dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ ./frontend/

# Set env var to disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
RUN npm run build --workspace=prodvor-frontend

# Expose the port the app runs on
EXPOSE 9002

# The start command is in the package.json, this will run `next start`
# It will be overridden by docker-compose in dev
CMD ["npm", "start", "--workspace=prodvor-frontend"]
