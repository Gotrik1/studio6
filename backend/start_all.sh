#!/usr/bin/env bash
set -e

echo "💥 Шаг 1: Удаляем старые контейнеры"
docker rm -f db keycloak-db keycloak pgadmin || true

echo "🌐 Шаг 2: Пересоздаём сеть"
docker network rm prodvor-network || true
docker network create --driver bridge prodvor-network

echo "🗄️ Шаг 3: Запускаем основную Postgres (prodvor)"
docker run -d --name db \
  --network prodvor-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=prodvor \
  -p 5432:5432 \
  postgres:17

echo "🛡️ Шаг 4: Запускаем Postgres для Keycloak"
docker run -d --name keycloak-db \
  --network prodvor-network \
  -e POSTGRES_USER=keycloak \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=keycloak \
  postgres:17

echo "🧩 Шаг 5: Запускаем pgAdmin (интерфейс для БД)"
docker run -d --name pgadmin \
  --network prodvor-network \
  -e PGADMIN_DEFAULT_EMAIL=admin@example.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  -p 5050:80 \
  dpage/pgadmin4

echo "🔑 Шаг 6: Запускаем Keycloak с миграцией и пробросом порта"
docker run -d --name keycloak \
  --network prodvor-network \
  -e KC_DB=postgres \
  -e KC_DB_URL_HOST=keycloak-db \
  -e KC_DB_URL_DATABASE=keycloak \
  -e KC_DB_USERNAME=keycloak \
  -e KC_DB_PASSWORD=password \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  -e KC_SPI_CONNECTIONS_JPA__QUARKUS__MIGRATION_STRATEGY=update \
  -p 8180:8080 \
  quay.io/keycloak/keycloak:26.3.1 \
  start-dev --import-realm

echo "✅ Все контейнеры запущены"
echo

# Проверяем
echo "📊 Состояние сети и контейнеров:"
docker network inspect prodvor-network --format 'Сеть: {{.Name}}, контейнеров: {{len .Containers}}'
docker ps --filter network=prodvor-network --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
