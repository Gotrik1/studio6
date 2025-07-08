
FROM node:20-alpine

# Устанавливаем OpenSSL, так как он необходим для Prisma Client
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Этот порт будет открыт в контейнере.
# Он будет проброшен на хост-машину в docker-compose.yml.
EXPOSE 3001

# Команда для запуска приложения
CMD ["npm", "run", "start:dev"]
