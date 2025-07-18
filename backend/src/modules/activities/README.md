# Модуль Активности

Этот модуль отвечает за создание и получение записей в глобальной и локальной (для площадок) ленте активности.

## API Endpoints

### `GET /activities/feed`

- **Описание:** Получает глобальную ленту активности для всех пользователей.
- **Ответ:** Массив объектов `Activity`, отсортированных по дате. Каждый объект содержит данные о пользователе, типе активности и метаданные.

### `GET /activities/playground/:playgroundId`

- **Описание:** Получает ленту активности, связанную с конкретной спортивной площадкой (например, чекины).
- **Ответ:** Массив объектов `Activity` типа `PLAYGROUND_CHECK_IN`.

### `POST /activities/status`

- **Описание:** Создает новую запись типа "статус". Требует аутентификации.
- **Тело запроса:**
  ```json
  { "text": "Мой новый статус!" }
  ```

### `POST /activities/check-in`

- **Описание:** Создает новую запись типа "чекин". Требует аутентификации.
- **Тело запроса:**
  ```json
  {
    "playgroundId": "string",
    "comment": "string",
    "photo": "string (base64 data URI)"
  }
  ```
