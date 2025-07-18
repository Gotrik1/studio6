# Руководство по реализации аутентификации

Этот документ предназначен для бэкенд-разработчиков и описывает шаги по настройке и интеграции системы аутентификации, регистрации и восстановления пароля с использованием **Keycloak** и **Kong API Gateway**.

## 1. Обзор архитектуры

Мы будем использовать стандартный для индустрии подход на основе OAuth 2.0 и OpenID Connect (OIDC).

- **Keycloak**: Выступает в роли централизованного сервера аутентификации (Identity Provider). Он управляет пользователями, ролями, сессиями и процессом входа.
- **Kong**: Выступает в роли API-шлюза. Он будет защищать наши бэкенд-сервисы, проверяя JWT-токены, выданные Keycloak, перед тем как пропустить запрос дальше.
- **Next.js (Frontend)**: Наш фронтенд будет взаимодействовать с Keycloak для аутентификации пользователя и получать JWT-токены. Затем он будет использовать эти токены для авторизованных запросов к API через Kong.

### Общий флоу аутентификации:

1.  Пользователь нажимает "Войти" на фронтенде.
2.  Фронтенд перенаправляет пользователя на страницу входа Keycloak.
3.  Пользователь вводит логин и пароль в интерфейсе Keycloak.
4.  Keycloak аутентифицирует пользователя и перенаправляет его обратно на фронтенд с `authorization code`.
5.  Фронтенд обменивает `authorization code` на `access token` (JWT) и `refresh token`, делая запрос к Token-эндпоинту Keycloak.
6.  Фронтенд сохраняет токены (например, в безопасных httpOnly-cookie).
7.  При каждом запросе к защищенному API фронтенд прикрепляет `access token` в заголовок `Authorization: Bearer <token>`.
8.  Kong перехватывает запрос, проверяет валидность JWT (подпись, срок действия) и, если все в порядке, пропускает запрос к соответствующему бэкенд-сервису.

## 2. Настройка компонентов

### Шаг 1: Настройка Keycloak

1.  **Создайте новый Realm**: Назовите его `prodvor`.
2.  **Создайте клиента**:
    - **Client ID**: `prodvor-frontend`
    - **Client Protocol**: `openid-connect`
    - **Access Type**: `public` (поскольку это одностраничное приложение, работающее в браузере).
    - **Valid Redirect URIs**: Укажите URI вашего фронтенд-приложения (например, `http://localhost:9002/*`, `https://your-domain.com/*`). Это важно для безопасности.
    - **Web Origins**: Укажите `+` или конкретные домены, чтобы разрешить CORS-запросы.
3.  **Настройте Identity Providers**: В разделе "Identity Providers" настройте интеграцию с провайдерами: Yandex, VK, Telegram, Gosuslugi.
4.  **Создайте роли**: В разделе "Roles" создайте роли, которые используются в приложении: `Администратор`, `Игрок`, `Тренер` и т.д.
5.  **Настройте пользователя**: Создайте тестового пользователя и назначьте ему роль.
6.  **Настройте аутентификацию (Authentication)**: Включите и настройте Two-Factor Authentication (например, через TOTP или SMS).

### Шаг 2: Настройка Kong

1.  **Установите Kong API Gateway**.
2.  **Настройте Service**: Создайте сервис, который указывает на ваш бэкенд (например, `host: backend-service, port: 8080`).
3.  **Настройте Route**: Создайте маршрут, который будет вести к этому сервису (например, `paths: /api`).
4.  **Примените OIDC плагин**:
    - Добавьте плагин `openid-connect` к вашему сервису или маршруту.
    - **`config.issuer`**: URL вашего Keycloak-реалма (например, `http://keycloak:8080/auth/realms/prodvor`).
    - **`config.client_id`**: `prodvor-frontend`.
    - Плагин будет автоматически проверять JWT-токен из заголовка `Authorization`. Если токен невалидный или отсутствует, Kong вернет `401 Unauthorized`.

## 3. Разработка API-эндпоинтов

Ваш основной бэкенд-сервис (написанный на Go, Java, Python и т.д.) будет получать запросы, уже прошедшие проверку в Kong.

### Регистрация (`/api/register`)

- **Frontend**: Форма регистрации в `src/widgets/register-form` будет вызывать этот эндпоинт.
- **Backend**:
  1.  Эндпоинт должен быть **публичным** (не требовать JWT).
  2.  Получает данные пользователя (email, password, name, role).
  3.  Использует **Keycloak Admin API** для создания нового пользователя. Для этого вам понадобится сервисный аккаунт (client с типом `confidential` и включенным `Service Accounts Enabled`) с правами на управление пользователями (`manage-users`).
  4.  После создания пользователя в Keycloak возвращает `201 Created`.

### Восстановление пароля

Этот флоу **полностью обрабатывается Keycloak**.

1.  **Frontend**: На странице входа должна быть ссылка "Забыли пароль?", которая ведет на страницу восстановления пароля в Keycloak:
    `{KEYCLOAK_URL}/auth/realms/prodvor/login-actions/reset-credentials`
2.  **Keycloak**: Отправляет пользователю email со ссылкой для сброса пароля.
3.  **Backend**: Не требуется никакой дополнительной логики.

## 4. Реализация в прототипе (Frontend)

**Важно:** Текущая реализация фронтенда использует **моковую систему аутентификации** для быстрой разработки и демонстрации. Вместо реальных вызовов к Keycloak и Kong используются **Server Actions** в Next.js.

- **`src/features/auth/actions.ts`**:
  - `login(email, password)`: Эта функция **имитирует** проверку пользователя. Она находит пользователя в моковом списке `src/shared/lib/mock-data/users.ts` и в случае успеха устанавливает `httpOnly` cookie с сессией. Реализован "бэкдор" для входа под администратором (`admin@example.com` / `superuser`).
  - `register(values)`: Эта функция **имитирует** регистрацию. Она не сохраняет пользователя в базу данных, а создает объект нового пользователя и немедленно записывает его в `httpOnly` cookie, после чего перенаправляет на страницу приветствия `/welcome`.
- **`src/middleware.ts`**: Это наш "пограничный контроль". Он перехватывает каждый запрос и проверяет наличие сессии в cookie. Если пользователь не авторизован и пытается зайти на защищенную страницу, он принудительно перенаправляется на страницу входа `/auth`. Эта логика сохранится и при переходе на JWT, но будет проверять наличие и валидность токена, а не cookie.

При переходе на продакшен-бэкенд необходимо будет заменить содержимое функций в `src/features/auth/actions.ts` на реальные вызовы OIDC-флоу и API-эндпоинтов, а также обновить логику `middleware.ts` для работы с JWT, как описано выше.
