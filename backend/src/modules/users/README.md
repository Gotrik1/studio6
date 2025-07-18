# Модуль Пользователей

Отвечает за всю логику, связанную с пользователями.

- CRUD операции для пользователей.
- Управление профилями.

## Схема регистрации (с Keycloak)

В продакшен-архитектуре, процесс регистрации делегирован Keycloak. Наш бэкенд **не обрабатывает пароли**.

1. **Frontend**: Пользователь заполняет форму регистрации.
2. **Frontend -> Backend**: Отправляет запрос на `POST /users` с `name` и `email`.
3. **Backend**:
   - Вызывает **Keycloak Admin API** для создания нового пользователя в Keycloak.
   - Если успешно, создает соответствующую запись в своей базе данных PostgreSQL.
   - Возвращает `201 Created`.
