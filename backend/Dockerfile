# /home/user/studio/backend/Dockerfile

# 1. Base Stage: Use a specific Node.js version for reproducibility
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# 2. Dependencies Stage: Install dependencies, including devDependencies for build tools
FROM base AS dependencies
# Устанавливаем рабочую директорию на уровень выше, чтобы правильно скопировать структуру монорепозитория
WORKDIR /usr/src/app
# Копируем корневые package.json и lock-файл
COPY package.json package-lock.json ./
# Копируем package.json бэкенда
COPY backend/package.json ./backend/
# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN npm install --workspace=prodvor-backend

# 3. Build Stage: Copy source code and build the application
FROM dependencies AS build
WORKDIR /usr/src/app
COPY . .
# Генерируем Prisma Client
RUN npm run prisma:generate --workspace=prodvor-backend
# Собираем NestJS приложение
RUN npm run build --workspace=prodvor-backend

# 4. Runner Stage: Create a slim production image
FROM base as runner
WORKDIR /usr/src/app

# Устанавливаем PATH, чтобы NestJS CLI был доступен
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Копируем только production-зависимости из builder
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/backend/package.json ./backend/

# Копируем скомпилированное приложение
COPY --from=build /usr/src/app/backend/dist ./backend/dist
COPY --from=build /usr/src/app/backend/prisma ./backend/prisma

# Expose the port the app runs on
EXPOSE 3001

# The command to run the application
CMD ["npm", "run", "start:dev", "--workspace=prodvor-backend"]
