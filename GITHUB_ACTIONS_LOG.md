# Лог Рабочих Решений для GitHub Actions

Этот документ служит для фиксации проверенных и работающих решений, примененных к CI/CD пайплайну (`.github/workflows/main.yml`) и связанным с ним файлам (`Dockerfile`, `docker-compose.ci.yml`). Он является **единственным источником правды** для конфигурации сборки.

## ✅ Принцип №1: Полная имитация локального окружения в CI

- **Статус:** ✅ **РЕШЕНО И ЗАФИКСИРОВАНО.**
- **Решение:** Отказаться от сложных, кастомных CI-шагов. CI-пайплайн должен **полностью имитировать** локальный запуск через `docker-compose`. Он должен:
  1. Использовать `docker-compose.yml` и файл переопределений `docker-compose.ci.yml`.
  2. Собирать все образы с помощью `docker compose build`.
  3. Запускать все сервисы в фоновом режиме через `docker compose up -d`.
  4. Использовать `healthcheck` и циклы `until` для ожидания полной готовности сервисов.
  5. Выполнять миграции через `docker compose run`.

---

## ✅ Принцип №2: Канонический Dockerfile для Node.js с Prisma

- **Статус:** ✅ **РЕШЕНО И ЗАФИКСИРОВАНО.**
- **Проблема:** Циклические ошибки: `Prisma Client not found`, `pnpm deploy` errors (`DIR_NOT_EMPTY`, `INVALID_TARGET`), `sh: prisma: not found`.
- **Причина:** Неправильный порядок команд `COPY` и `RUN`, который приводил к тому, что Prisma Client либо не генерировался до копирования, либо его генерация ломалась из-за отсутствия `devDependencies` на production-стадиях.
- **Окончательное Решение:** Использовать **стандартный, надежный multi-stage паттерн сборки**, который гарантирует корректную генерацию клиента и установку зависимостей.

### **Структура Dockerfile (для `backend` и `frontend`)**

1.  **Этап `builder` (сборка):**
    *   `WORKDIR /usr/src/app`
    *   `COPY` **только** манифестов (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`).
    *   `COPY` **только** `backend/prisma/schema.prisma`.
    *   `RUN corepack enable && pnpm install` для установки **всех** зависимостей, включая `devDependencies`.
    *   `RUN pnpm --filter prodvor-backend prisma:generate` для **гарантированной** генерации клиента.
    *   `COPY . .` для копирования всего остального исходного кода.
    *   `RUN pnpm --filter <package> build` для компиляции проекта.

2.  **Этап `pruner` (оптимизация):**
    *   Начинается с чистого образа `node:20`.
    *   `WORKDIR /usr/src/app`
    *   `COPY` **только** манифестов из `builder`.
    *   `COPY` **только** скомпилированного `dist` из `builder`.
    *   `COPY` **только** сгенерированного Prisma Client (`node_modules/.prisma` и `node_modules/@prisma/client`) из `builder`.
    *   `RUN corepack enable && pnpm install --prod --ignore-scripts`. Флаг `--ignore-scripts` критически важен, чтобы `postinstall` не пытался запуститься без `prisma` CLI.

3.  **Этап `runner` (финальный образ):**
    *   Легковесный образ `node:20-alpine`.
    *   `WORKDIR /usr/src/app`
    *   `COPY` **всё** содержимое из `pruner`.
    *   `CMD` для запуска приложения.
