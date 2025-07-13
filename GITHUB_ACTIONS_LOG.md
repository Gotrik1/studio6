# Лог Рабочих Решений для GitHub Actions

Этот документ служит для фиксации проверенных и работающих решений, примененных к CI/CD пайплайну (`.github/workflows/main.yml`) и связанным с ним файлам (`Dockerfile`, `docker-compose.ci.yml`).

## 1. Multi-stage сборка в Dockerfile

**Проблема:** Ошибки `prisma: not found` и `nest: not found` во время сборки, ошибки TypeScript из-за отсутствия сгенерированного Prisma-клиента.

**Рабочее решение:** Использование многоэтапной сборки (multi-stage build).

- **Стадия `builder`:**
    1.  Копируются **только** файлы манифеста (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`, `tsconfig.json`, `prisma/schema.prisma`).
    2.  Запускается `pnpm install` для установки **всех** зависимостей, включая `devDependencies`. Это критично для доступа к `prisma` и `nest` CLI.
    3.  **После `pnpm install`** запускается `pnpm --filter prodvor-backend prisma:generate` для создания Prisma Client.
    4.  Запускается `pnpm --filter prodvor-backend build` для компиляции TypeScript-кода.

- **Стадия `runner` (финальный образ):**
    1.  Используется легковесный базовый образ (например, `node:20-alpine`).
    2.  Устанавливаются **только production-зависимости** (`pnpm install --prod`).
    3.  Из стадии `builder` копируются **только** необходимые артефакты:
        -   Скомпилированный проект (`/usr/src/app/backend/dist`).
        -   Сгенерированный Prisma Client (`/usr/src/app/backend/node_modules/.prisma`).

**Обоснование:** Этот подход гарантирует, что на момент компиляции все инструменты доступны, а финальный образ остается маленьким и содержит только то, что нужно для запуска приложения.

## 2. Оркестрация сервисов в CI

**Проблема:** Нестабильный запуск, ошибки `service "migrations" didn't complete successfully`, ошибки подключения к базе данных.

**Рабочее решение:**

- **Явное использование всех compose-файлов:** Все вызовы `docker compose` в `.github/workflows/main.yml` должны явно включать все необходимые файлы: `docker compose -f docker-compose.yml -f docker-compose.ci.yml <command>`. Это гарантирует, что Docker видит все сервисы, включая временные (например, `migrations`).

- **Явная сборка образов перед запуском:** В `.github/workflows/main.yml` перед `docker compose up` необходимо принудительно собрать свежие образы с помощью `docker/build-push-action@v5` с опцией `load: true`. Это предотвращает использование устаревших образов из локального кэша Docker.

- **Правильная последовательность запуска:**
    1.  Сервис `db` имеет `healthcheck`.
    2.  Сервис `migrations` в `docker-compose.ci.yml` зависит от `db` (`depends_on: { db: { condition: service_healthy } }`).
    3.  Сервис `backend` зависит от `migrations` (`depends_on: { migrations: { condition: service_completed_successfully } }`).

**Обоснование:** Это обеспечивает строгий порядок: база данных должна быть полностью готова, затем успешно применяются миграции, и только после этого стартует бэкенд.

## 3. Установка зависимостей в CI

**Проблема:** Конфликты зависимостей, ошибки `ERESOLVE`, падения `pnpm install`.

**Рабочее решение:**

- **Единый источник истины:** Установка зависимостей происходит **только** внутри `Dockerfile` во время сборки образа. Шаг `pnpm install` в `main.yml` **удален**.
- **Изоляция зависимостей:** `devDependencies` и `dependencies` для `frontend` и `backend` четко разделены и находятся в своих `package.json`. Корневой `package.json` содержит только скрипты для запуска воркспейсов.

**Обоснование:** Такой подход исключает конфликты и несоответствия, так как сборка каждого приложения происходит в изолированном и предсказуемом окружении.
