# Stage 1: Установка зависимостей и сборка
FROM node:20 as builder
WORKDIR /usr/src/app

# Включаем corepack для управления версией pnpm
RUN corepack enable

# Копируем корневые файлы манифеста
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./.npmrc* ./

# Копируем package.json каждого воркспейса, чтобы pnpm понял структуру
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Копируем схему Prisma, она нужна для postinstall
COPY backend/prisma ./backend/prisma

# Устанавливаем ВСЕ зависимости, включая devDependencies.
# На этом шаге также должен запускаться `prisma generate` через postinstall,
# но мы дублируем его в CI для надежности.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Копируем ВЕСЬ исходный код
COPY . .

# Собираем проект
RUN pnpm --filter prodvor-backend build

# Stage 2: Оптимизация node_modules для production
FROM node:20 as pruner
WORKDIR /usr/src/app

# Включаем corepack
RUN corepack enable

COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# Устанавливаем только production-зависимости
RUN pnpm --filter prodvor-backend deploy --prod ./backend

# Stage 3: Финальный образ
FROM node:20-alpine as runner
WORKDIR /app

ENV NODE_ENV production

# Устанавливаем OpenSSL, т.к. Prisma Client для Node.js его требует
RUN apk add --no-cache openssl

COPY --from=pruner /usr/src/app/backend/dist ./dist
COPY --from=pruner /usr/src/app/backend/node_modules ./node_modules
COPY --from=pruner /usr/src/app/backend/package.json ./package.json

# Копируем сгенерированную схему, которая нужна Prisma Client во время выполнения
COPY --from=builder /usr/src/app/backend/prisma/schema.prisma ./prisma/schema.prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]
