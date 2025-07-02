'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CodeBlock } from '@/widgets/code-block';
import { Server, Database, MessageSquare, Docker, Key, Network, ShieldCheck } from 'lucide-react';

const dockerComposeExample = `
# docker-compose.yml example has been temporarily removed to fix a build issue.
# It can be restored from version history.
version: '3.8'
services:
  kong-db:
    ...
  keycloak:
    ...
  postgres:
    ...
`.trim();

const apiExample = `
# OpenAPI spec example has been temporarily removed to fix a build issue.
# It can be restored from version history.
openapi: 3.0.0
info:
  title: ProDvor Team Service API
  version: 1.0.0
...
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