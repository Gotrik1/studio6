'use client';

export default function BackendRoadmapPage() {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-card text-card-foreground rounded-lg shadow-sm">
        <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert max-w-none space-y-6">
          <h1 className="font-headline text-4xl font-bold border-b pb-2">План-требования к Backend API для проекта "ProDvor"</h1>
          
          <section>
            <p><strong>Версия:</strong> 1.4</p>
            <p><strong>Дата:</strong> 27.07.2024</p>
            <p className="mt-4 text-muted-foreground">Этот документ описывает минимально необходимый набор API-эндпоинтов, который должен реализовать бэкенд для полноценной интеграции с разработанным фронтендом.</p>
            <h4>Источник правды для моделей данных:</h4>
            <ol className="list-decimal list-inside">
                <li><strong>База данных:</strong> Файл <code>schema.prisma</code> является основным источником для структуры таблиц БД.</li>
                <li><strong>API-контракты:</strong> TypeScript-типы, расположенные в директориях <code>src/entities/**/types.ts</code> на фронтенде, являются точной спецификацией данных, которые фронтенд ожидает от API.</li>
            </ol>
          </section>
          
          <hr />
  
          <section>
            <h2 className="font-headline text-3xl font-bold">1. Общие принципы и авторизация</h2>
            <h3 className="font-headline text-2xl font-semibold">1.1. Базовый URL</h3>
            <p>Все эндпоинты должны быть доступны по префиксу, например: <code>/api/v1/</code>. Фронтенд настроен на получение URL из переменной окружения <code>NEXT_PUBLIC_API_URL</code>.</p>
            <h3 className="font-headline text-2xl font-semibold">1.2. Авторизация (JWT)</h3>
            <ul>
                <li><strong>Схема:</strong> Все защищенные эндпоинты должны проверять <code>Authorization</code> заголовок на наличие <code>Bearer &lt;token&gt;</code>.</li>
                <li><strong>Получение токена:</strong> Эндпоинт <code>POST /api/v1/auth/login</code> должен возвращать JWT-токен при успешной аутентификации.</li>
                <li><strong>Интеграция с Kong/Keycloak:</strong> Предполагается, что API-шлюз (Kong) будет валидировать токены перед проксированием запроса на соответствующий сервис.</li>
            </ul>
             <h3 className="font-headline text-2xl font-semibold">1.3. Формат ответов</h3>
            <ul>
                <li><strong>Успешные запросы:</strong> <code>200 OK</code>, <code>201 Created</code>. Тело ответа — JSON с запрошенными данными.</li>
                <li><strong>Ошибки:</strong>
                    <ul className="pl-4 mt-2 list-disc list-inside">
                        <li><code>400 Bad Request</code>: Ошибка валидации данных. В теле ответа желательно возвращать объект с описанием ошибок по полям.</li>
                        <li><code>401 Unauthorized</code>: Пользователь не авторизован (нет токена или он невалиден).</li>
                        <li><code>403 Forbidden</code>: У пользователя нет прав на выполнение данного действия.</li>
                        <li><code>404 Not Found</code>: Запрошенный ресурс не найден.</li>
                        <li><code>500 Internal Server Error</code>: Внутренняя ошибка сервера.</li>
                    </ul>
                </li>
            </ul>
          </section>
  
          <hr />
  
           <section>
            <h2 className="font-headline text-3xl font-bold">2. Эндпоинты по сущностям</h2>
            <h3 className="font-headline text-2xl font-semibold">2.1. Аутентификация (<code>/auth</code>)</h3>
            <ul>
                <li><code>POST /auth/login</code>: Вход пользователя.</li>
                <li><code>POST /auth/register</code>: Регистрация (шаг 1: отправка OTP).</li>
                <li><code>POST /auth/verify-otp</code>: Подтверждение регистрации (шаг 2).</li>
                <li><code>POST /auth/create-profile</code>: Создание профиля после верификации (шаг 3).</li>
                <li><code>POST /auth/recover-password</code>: Запрос на восстановление пароля.</li>
            </ul>
            <h3 className="font-headline text-2xl font-semibold">2.2. Пользователи (<code>/users</code>)</h3>
            <ul>
                <li><code>GET /users</code>: Получить список всех пользователей (для админ-панели).</li>
                <li><code>GET /users/:id</code>: Получить детальную информацию о пользователе по его ID. В качестве ID может быть `me` для получения профиля текущего авторизованного пользователя.</li>
                <li><code>PATCH /users/:id</code>: Обновить информацию о пользователе (например, из страницы настроек).</li>
            </ul>
           </section>

          <style jsx>{`
            .prose h1 { margin-bottom: 1rem; }
            .prose h2 { margin-top: 2rem; margin-bottom: 1rem; }
            .prose h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; }
            .prose h4 { margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600; }
            .prose p, .prose ul, .prose ol { margin-bottom: 1rem; }
            .prose ul, .prose ol { list-style-position: inside; padding-left: 1rem; }
            .prose ul { list-style-type: disc; }
            .prose code { 
                background-color: hsl(var(--muted)); 
                padding: 0.2em 0.4em; 
                margin: 0; 
                font-size: 85%; 
                border-radius: 6px;
            }
            .prose hr { border-color: hsl(var(--border)); margin-top: 2rem; margin-bottom: 2rem; }
          `}</style>
        </article>
      </div>
    )
  }
  