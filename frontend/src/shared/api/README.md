# Документация по API бэкенда "ProDvor"

Этот документ описывает основные эндпоинты бэкенд-сервиса.

**Базовый URL:** `http://localhost:3001`

---

## Аутентификация (`/auth`)

### `POST /auth/login`
-   **Описание:** Аутентификация пользователя и получение токена доступа.
-   **Тело запроса:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
-   **Ответ:**
    ```json
    {
      "access_token": "your_jwt_token",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "avatar": "string",
        "role": "string"
      }
    }
    ```

---

## Пользователи (`/users`)

### `POST /users`
-   **Описание:** Регистрация нового пользователя.
-   **Тело запроса:**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "role": "string"
    }
    ```
-   **Ответ:** `201 Created` с объектом пользователя (без хэша пароля).

### `GET /users/leaderboard`
-   **Описание:** Получение таблицы лидеров по очкам опыта (XP).
-   **Ответ:** Массив объектов:
    ```json
    [{
      "rank": "number",
      "name": "string",
      "points": "number",
      "avatar": "string",
      "avatarHint": "string"
    }]
    ```

### `GET /users/:id`
-   **Описание:** Получение детальной информации о пользователе по его ID.
-   **Ответ:** Объект пользователя с расширенными данными.

---

## Команды (`/teams`)

### `POST /teams`
-   **Описание:** Создание новой команды.
-   **Тело запроса:**
    ```json
    {
      "name": "string",
      "captainId": "string",
      "game": "string",
      "motto": "string",
      "logo": "string",
      "dataAiHint": "string"
    }
    ```
-   **Ответ:** Объект созданной команды.

### `GET /teams`
-   **Описание:** Получение списка всех команд.
-   **Ответ:** Массив объектов команд.

### `GET /teams/slug/:slug`
-   **Описание:** Получение детальной информации о команде по ее `slug`.
-   **Ответ:** Объект команды с составом, статистикой и т.д.

### `GET /teams/leaderboard`
-   **Описание:** Получение таблицы лидеров команд.
-   **Ответ:** Массив объектов с данными о рейтинге команд.

---

## Турниры (`/tournaments`)

### `POST /tournaments`
-   **Описание:** Создание нового турнира.
-   **Тело запроса:**
    ```json
    {
      "name": "string",
      "game": "string",
      "format": "single_elimination" | "round_robin",
      "prizePool": "number",
      "startDate": "Date"
    }
    ```

### `GET /tournaments`
-   **Описание:** Получение списка всех турниров.
-   **Ответ:** Массив объектов турниров.

### `GET /tournaments/slug/:slug`
-   **Описание:** Получение детальной информации о турнире по его `slug`.
-   **Ответ:** Объект турнира с сеткой, участниками и т.д.

---

## Матчи (`/matches`)

### `POST /matches`
-   **Описание:** Создание нового матча (обычно выполняется автоматически при старте турнира).
-   **Тело запроса:**
    ```json
    {
      "team1Id": "string",
      "team2Id": "string",
      "tournamentId": "string",
      "scheduledAt": "Date"
    }
    ```

### `GET /matches`
-   **Описание:** Получение списка всех матчей.

### `GET /matches/:id`
-   **Описание:** Получение детальной информации о матче.

### `PATCH /matches/:id/score`
-   **Описание:** Обновление счета завершенного матча.
-   **Тело запроса:**
    ```json
    {
      "score1": "number",
      "score2": "number",
      "comment": "string"
    }
    ```

---

## AI-сервисы (`/ai`)

Этот раздел содержит эндпоинты, которые вызывают Genkit-флоу. Тело запроса для каждого эндпоинта соответствует `InputSchema` соответствующего флоу.

-   `POST /ai/generate-team-concept`: Создание концепции команды.
-   `POST /ai/generate-user-avatar`: Генерация аватара пользователя.
-   `POST /ai/generate-profile-banner`: Генерация баннера профиля.
-   `GET /ai/dashboard-news`: Получение новостной сводки для дашборда.
-   `POST /ai/analyze-join-request`: Анализ заявки на вступление в команду.
-   `POST /ai/analyze-team-performance`: Анализ производительности команды.
-   `POST /ai/analyze-esports-performance`: Анализ киберспортивной производительности.
-   `POST /ai/analyze-player-performance`: Анализ физической подготовки.
-   `POST /ai/generate-training-plan`: Создание плана тренировок.
-   `POST /ai/smart-search`: Умный поиск по платформе.
-   ... и многие другие. Полный список можно найти в `backend/src/modules/ai/ai.controller.ts`.
