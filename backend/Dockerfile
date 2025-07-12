# === Base Stage: Common setup for all other stages ===
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# === Dependencies Stage: Install all dependencies (prod + dev) ===
# This stage installs all dependencies needed for building and linting.
# It leverages Docker caching by only copying package.json files first.
FROM base AS dependencies

# Копируем package.json и lock-файл из корня монорепозитория
COPY package.json package-lock.json ./

# Копируем package.json бэкенда
COPY package.json ./backend/

# Устанавливаем все зависимости, включая devDependencies (они нужны для сборки и prisma generate)
RUN npm install --workspace=prodvor-backend

# === Build Stage: Compile TypeScript to JavaScript ===
# This stage uses the installed dependencies to build the application.
FROM dependencies AS build

# Копируем весь исходный код бэкенда и сгенерированный Prisma клиент
COPY . .

# Устанавливаем PATH, чтобы Nest CLI был доступен
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Генерируем Prisma Client (необходимо после копирования schema.prisma)
RUN npm run prisma:generate --workspace=prodvor-backend

# Собираем NestJS приложение
RUN npm run build --workspace=prodvor-backend

# === Runner Stage: Final, lightweight image for production ===
# This stage creates the final image, copying only the necessary built files.
FROM base AS runner

# Копируем package.json и lock-файл из корня монорепозитория
COPY package.json package-lock.json ./

# Копируем package.json бэкенда
COPY package.json ./backend/

# Устанавливаем только production зависимости для уменьшения размера образа
RUN npm install --workspace=prodvor-backend --omit=dev

# Устанавливаем PATH, чтобы Nest CLI был доступен для start:prod
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Копируем собранные файлы и Prisma клиент из стадии 'build'
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=build /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma

EXPOSE 3001

# Команда для запуска приложения
CMD ["npm", "run", "start:prod", "--workspace=prodvor-backend"]
