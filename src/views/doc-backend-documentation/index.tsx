'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { CodeBlock } from '@/widgets/code-block';
import { Server, Database, MessageSquare, Docker, Key, Network, GitBranch, ShieldCheck } from 'lucide-react';

const dockerComposeExample = `
version: '3.8'

services:
  # ------------------
  #  API Gateway
  # ------------------
  kong-db:
    image: postgres:13
    container_name: kong-db
    environment:
      - POSTGRES_USER=kong
      - POSTGRES_PASSWORD=kong
      - POSTGRES_DB=kong
    volumes:
      - kong_data:/var/lib/postgresql/data
    networks:
      - prodvor-net

  kong-migrations:
    image: kong:latest
    container_name: kong-migrations
    command: "kong migrations bootstrap"
    depends_on:
      - kong-db
    environment:
      - KONG_DATABASE=postgres
      - KONG_PG_HOST=kong-db
      - KONG_PG_USER=kong
      - KONG_PG_PASSWORD=kong
    networks:
      - prodvor-net

  kong:
    image: kong:latest
    container_name: kong-gateway
    depends_on:
      - kong-migrations
    environment:
      - KONG_DATABASE=postgres
      - KONG_PG_HOST=kong-db
      - KONG_PG_USER=kong
      - KONG_PG_PASSWORD=kong
      - KONG_PROXY_ACCESS_LOG=/dev/stdout
      - KONG_ADMIN_ACCESS_LOG=/dev/stdout
      - KONG_PROXY_ERROR_LOG=/dev/stderr
      - KONG_ADMIN_ERROR_LOG=/dev/stderr
      - KONG_ADMIN_LISTEN=0.0.0.0:8001
    ports:
      - "8000:8000" # Proxy
      - "8001:8001" # Admin API
    networks:
      - prodvor-net

  konga: # UI for Kong
    image: pantsel/konga
    container_name: konga
    depends_on:
      - kong
    ports:
      - "1337:1337"
    environment:
      - NODE_ENV=development
    networks:
      - prodvor-net

  # ------------------
  #  Auth Service
  # ------------------
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    container_name: keycloak
    command: "start-dev"
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin
      - KC_DB=postgres
      - KC_DB_URL_HOST=keycloak-db
      - KC_DB_URL_DATABASE=keycloak
      - KC_DB_URL_USER=keycloak
      - KC_DB_PASSWORD=password
    ports:
      - "8180:8080"
    depends_on:
      - keycloak-db
    networks:
      - prodvor-net

  keycloak-db:
    image: postgres:13
    container_name: keycloak-db
    environment:
      - POSTGRES_DB=keycloak
      - POSTGRES_USER=keycloak
      - POSTGRES_PASSWORD=password
    volumes:
      - keycloak_data:/var/lib/postgresql/data
    networks:
      - prodvor-net

  # ------------------
  #  Main Database
  # ------------------
  postgres:
    image: postgres:14-alpine
    container_name: postgres-db
    environment:
      - POSTGRES_USER=prodvor
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=prodvor_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - prodvor-net
      
  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@prodvor.com
      - PGADMIN_DEFAULT_PASSWORD=admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - prodvor-net

  # ------------------
  #  Message Broker
  # ------------------
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672"  # AMQP
      - "15672:15672" # Management UI
    networks:
      - prodvor-net

  # ------------------
  #  Backend Services
  # ------------------
  user_service:
    build:
      context: ./services/user-service
      dockerfile: Dockerfile
    container_name: user-service
    ports:
      - "3001:3000"
    depends_on:
      - postgres
      - rabbitmq
    networks:
      - prodvor-net
  # ... Add other services (team-service, tournament-service, etc.) here
  
networks:
  prodvor-net:
    driver: bridge

volumes:
  kong_data:
  keycloak_data:
  postgres_data:
`.trim();

const apiExample = `
openapi: 3.0.0
info:
  title: ProDvor Team Service API
  version: 1.0.0
paths:
  /teams:
    post:
      summary: Создать новую команду
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name: { type: string, example: "Кибер Орлы" }
                motto: { type: string, example: "Летаем высоко" }
                game: { type: string, example: "Valorant" }
      responses:
        '201':
          description: Команда успешно создана
          content:
            application/json:
              schema:
                '$ref': '#/components/schemas/Team'
        '401':
          description: Неавторизован
components:
  schemas:
    Team:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        # ... other fields
`.trim();

export function BackendDocumentationPage() {
    return (
        <div className="prose dark:prose-invert max-w-none opacity-0 animate-fade-in-up">
            <h1>Техническая Документация Бэкенда "ProDvor"</h1>
            <p className="lead">
                Этот документ служит центральным источником информации для разработки, развертывания и поддержки серверной части платформы "ProDvor".
            </p>

            <h2>1. Обзор Архитектуры</h2>
            <p>
                Бэкенд "ProDvor" спроектирован на основе **микросервисной архитектуры**. Этот подход обеспечивает гибкость, масштабируемость и независимость разработки отдельных частей системы. Все запросы от фронтенда проходят через **API Gateway (Kong)**, который отвечает за аутентификацию, маршрутизацию и безопасность.
            </p>
            <Card className="not-prose my-6">
                <CardHeader>
                    <CardTitle>Ключевые компоненты:</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul>
                        <li><strong>Frontend (Next.js)</strong>: Клиентское приложение.</li>
                        <li><strong>Kong API Gateway</strong>: Единая точка входа для всех API, управляет трафиком и безопасностью.</li>
                        <li><strong>Keycloak</strong>: Централизованный сервис для аутентификации и авторизации (Identity & Access Management).</li>
                        <li><strong>Микросервисы (Node.js)</strong>: Набор независимых сервисов, каждый из которых отвечает за свою бизнес-область (пользователи, команды, турниры).</li>
                        <li><strong>PostgreSQL</strong>: Основная реляционная база данных для хранения данных.</li>
                        <li><strong>RabbitMQ (Брокер сообщений)</strong>: Обеспечивает асинхронное взаимодействие между микросервисами.</li>
                    </ul>
                </CardContent>
            </Card>

            <h2>2. Технологический Стек</h2>
            <div className="not-prose grid md:grid-cols-2 gap-6 my-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Docker /> Контейнеризация</CardTitle></CardHeader>
                    <CardContent>
                        <p><strong>Docker & Docker Compose</strong></p>
                        <p className="text-sm text-muted-foreground">Для унификации окружения разработки и продакшена. Обеспечивает простоту развертывания всего стека одной командой.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Server /> Среда выполнения</CardTitle></CardHeader>
                    <CardContent>
                        <p><strong>Node.js & TypeScript</strong></p>
                        <p className="text-sm text-muted-foreground">Выбран за высокую производительность I/O-операций, обширную экосистему npm и строгую типизацию для надежности кода.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Database /> База данных</CardTitle></CardHeader>
                    <CardContent>
                        <p><strong>PostgreSQL & Prisma</strong></p>
                        <p className="text-sm text-muted-foreground">Мощная реляционная СУБД в связке с Prisma ORM для типобезопасного взаимодействия с базой данных и легких миграций.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Network /> API Gateway</CardTitle></CardHeader>
                    <CardContent>
                        <p><strong>Kong API Gateway</strong></p>
                        <p className="text-sm text-muted-foreground">Управляет маршрутизацией, аутентификацией (через OIDC плагин), логированием и безопасностью на входе в систему.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Key /> Аутентификация</CardTitle></CardHeader>
                    <CardContent>
                        <p><strong>Keycloak</strong></p>
                        <p className="text-sm text-muted-foreground">Стандарт индустрии для управления пользователями, ролями и сессиями. Интегрируется с Kong через OpenID Connect.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare /> Брокер сообщений</CardTitle></CardHeader>
                    <CardContent>
                        <p><strong>RabbitMQ / NATS</strong></p>
                        <p className="text-sm text-muted-foreground">Для асинхронного обмена событиями между сервисами. RabbitMQ - надежный выбор, NATS - современная альтернатива.</p>
                    </CardContent>
                </Card>
            </div>

            <h2>3. Декомпозиция на Микросервисы</h2>
            <p>Предлагается следующая структура микросервисов, каждый из которых имеет свою зону ответственности:</p>
            <ul>
                <li><code>UserService</code>: Управление профилями, статистикой и настройками пользователей.</li>
                <li><code>TeamService</code>: Создание команд, управление составом, обработка заявок.</li>
                <li><code>TournamentService</code>: Управление турнирами, матчами, генерация сеток.</li>
                <li><code>TrainingService</code>: Управление программами тренировок и дневниками.</li>
                <li><code>NotificationService</code>: Отправка push-уведомлений, email-рассылок (подписывается на события от других сервисов).</li>
                <li><code>PaymentService</code>: Интеграция с платежными системами для PRO-подписок.</li>
            </ul>

            <h2>4. Спецификация API</h2>
            <p>API должен следовать принципам REST и использовать JSON для обмена данными. Все эндпоинты, требующие авторизации, должны быть защищены JWT-токеном, проверяемым на уровне Kong.</p>
            <CodeBlock code={apiExample} language="yaml" />

            <h2>5. Локальная Разработка</h2>
            <p>Для запуска всего бэкенд-стека локально используется Docker Compose. Ниже представлен пример файла `docker-compose.yml`, который поднимает все необходимые сервисы.</p>
             <CodeBlock code={dockerComposeExample} language="yaml" />

            <h2>6. Безопасность</h2>
             <Card className="not-prose my-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck /> Ключевые аспекты безопасности</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Аутентификация</strong>: Все запросы к защищенным эндпоинтам должны содержать валидный JWT-токен в заголовке `Authorization: Bearer <token>`.</p>
                    <p><strong>Авторизация</strong>: Микросервисы должны проверять роли (claims) пользователя из JWT-токена для доступа к определенным ресурсам (например, только `ADMINISTRATOR` может получить доступ к панели управления).</p>
                    <p><strong>Валидация данных</strong>: Все входящие данные должны проходить строгую валидацию (например, с помощью Zod или Joi) для предотвращения инъекций и некорректных данных.</p>
                    <p><strong>Переменные окружения</strong>: Все чувствительные данные (ключи API, пароли от БД) должны храниться в переменных окружения и никогда не должны быть закоммичены в репозиторий.</p>
                </CardContent>
            </Card>

        </div>
    );
}
