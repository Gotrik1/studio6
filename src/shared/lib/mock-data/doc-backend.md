# Техническая Документация Бэкенда "ProDvor"

Этот документ служит центральным источником информации для разработки, развертывания и поддержки серверной части платформы "ProDvor".

## 1. Обзор архитектуры

Мы используем микросервисную архитектуру для обеспечения гибкости, масштабируемости и независимого развертывания компонентов.

-   **API Gateway (Kong)**: Единая точка входа для всех клиентских запросов. Отвечает за маршрутизацию, аутентификацию (проверка JWT), ограничение скорости и логирование.
-   **Identity Provider (Keycloak)**: Централизованное управление пользователями, ролями, аутентификацией и авторизацией.
-   **Основные сервисы (Node.js)**: Набор микросервисов, отвечающих за конкретную бизнес-логику:
    -   **`user-service`**: Управление профилями пользователей, настройками, друзьями.
    -   **`team-service`**: Создание команд, управление составом, заявки на вступление.
    -   **`tournament-service`**: Управление турнирами, генерация сеток, обработка результатов.
    -   **`match-service`**: Логика матчей, статистика, разрешение споров.
    -   **`chat-service`**: Обработка real-time сообщений через WebSocket, управление комнатами чатов, история сообщений.
    -   **`notification-service`**: Отправка асинхронных уведомлений (push, email).
-   **Брокер сообщений (NATS / RabbitMQ)**: Асинхронное взаимодействие между сервисами. Используется для доставки сообщений в `chat-service`, обработки оффлайн-сообщений и для `notification-service`.
-   **База данных (PostgreSQL)**: Основное хранилище данных для всех сервисов.
-   **AI Gateway (Genkit)**: Отдельный шлюз или сервис, который инкапсулирует взаимодействие с моделями Google AI, предоставляя безопасные эндпоинты для фронтенда.

## 2. Технологический стек

| Компонент | Технология | Примечание |
| :--- | :--- | :--- |
| **Среда выполнения** | Node.js (v20+) | Используем LTS-версию для стабильности. |
| **Фреймворк** | NestJS | Предоставляет модульную архитектуру и DI "из коробки". |
| **База данных** | PostgreSQL (v15+) | Надежная и масштабируемая реляционная СУБД. |
| **ORM** | Prisma | Упрощает взаимодействие с базой данных и миграции. |
| **API Gateway** | Kong | Централизованная обработка входящих запросов. |
| **GUI для Kong** | Konga | Веб-интерфейс для удобной настройки Kong. |
| **IdP** | Keycloak | Управление пользователями, ролями и аутентификацией. |
| **Брокер сообщений** | NATS / RabbitMQ | Для асинхронных операций (чаты, нотификации). |
| **Контейнеризация** | Docker, Docker Compose | Для локальной разработки и развертывания. |
| **Кеширование** | Redis | Для кеширования сессий, часто запрашиваемых данных. |

## 3. Настройка окружения

### Пример `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: prodvor_postgres
    environment:
      POSTGRES_USER: prodvor
      POSTGRES_PASSWORD: password
      POSTGRES_DB: prodvor
    ports:
      - "5432:5432"
    volumes:
      - prodvor_db_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: prodvor_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    container_name: prodvor_keycloak
    command: start-dev
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8080:8080"
    depends_on:
      - postgres

  kong-db:
    image: postgres:13
    container_name: prodvor_kong_db
    environment:
      - POSTGRES_USER=kong
      - POSTGRES_PASSWORD=kong
      - POSTGRES_DB=kong
    volumes:
      - kong_db_data:/var/lib/postgresql/data
    
  kong-migration:
    image: kong:3.4
    container_name: prodvor_kong_migration
    command: "kong migrations bootstrap"
    environment:
      - KONG_DATABASE=postgres
      - KONG_PG_HOST=kong-db
      - KONG_PG_USER=kong
      - KONG_PG_PASSWORD=kong
      - KONG_PG_DATABASE=kong
    depends_on:
      - kong-db

  kong:
    image: kong:3.4
    container_name: prodvor_kong
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-db
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kong
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001, 0.0.0.0:8444 ssl
    ports:
      - "8000:8000"
      - "8443:8443"
      - "8001:8001"
      - "8444:8444"
    depends_on:
      - kong-migration

  konga:
    image: pantsel/konga
    container_name: prodvor_konga
    ports:
      - "1337:1337"
    environment:
      - NODE_ENV=development
      - TOKEN_SECRET=somerandomstring
    depends_on:
      - kong

volumes:
  prodvor_db_data:
  kong_db_data:
```

## 4. Спецификация API (Пример для `user-service`)

Все API должны следовать спецификации OpenAPI 3.0.

```yaml
openapi: 3.0.0
info:
  title: User Service API
  version: 1.0.0
paths:
  /users/me:
    get:
      summary: Получить профиль текущего пользователя
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Успешный ответ
          content:
            application/json:
              schema:
                '$ref': '#/components/schemas/UserProfile'
        '401':
          description: Не авторизован
  /users/{id}:
    get:
      summary: Получить профиль пользователя по ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Успешный ответ
          content:
            application/json:
              schema:
                '$ref': '#/components/schemas/UserProfile'
        '404':
          description: Пользователь не найден

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    UserProfile:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
          format: email
        role:
          type: string
        avatar:
          type: string
          format: uri
```

## 5. Аутентификация и авторизация (детально)

Процесс описан в [AUTH_IMPLEMENTATION.md](AUTH_IMPLEMENTATION.md).

Ключевые моменты для бэкенда:
1.  **Защита API**: Все эндпоинты, кроме публичных (`/register`, `/login`, `/health`), должны быть защищены в Kong с помощью `openid-connect` плагина.
2.  **Информация о пользователе**: Kong, после валидации JWT, передает информацию о пользователе (claims) в заголовках (`X-Userinfo`, `X-Authenticated-Userid`). Сервисы должны доверять этим заголовкам.
3.  **Регистрация**: Эндпоинт `/register` должен быть публичным. Он принимает данные пользователя, валидирует их и использует **Keycloak Admin API** для создания нового пользователя. Для этого необходим сервисный аккаунт с правами `manage-users`.
4.  **Роли**: Сервисы должны проверять роль пользователя (переданную в JWT) для выполнения авторизованных действий.

## 6. Взаимодействие с AI-сервисами (Genkit)

Для обеспечения безопасности и контроля, Genkit-флоу не должны вызываться напрямую с фронтенда в продакшене.

1.  **Backend-for-Frontend (BFF)**: Создайте специальный сервис или эндпоинты в существующих сервисах, которые будут выступать в роли прокси для Genkit.
2.  **Аутентификация**: Эти прокси-эндпоинты должны быть защищены JWT, как и остальные части API.
3.  **Передача данных**: BFF-эндпоинт принимает запрос от фронтенда, обогащает его необходимой информацией из базы данных (например, полная статистика игрока) и затем вызывает соответствующий Genkit-флоу.
4.  **Безопасность ключей**: `GOOGLE_API_KEY` должен храниться только на бэкенде и никогда не передаваться на клиент.
