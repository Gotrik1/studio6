

import { CodeBlock } from '@/widgets/code-block';
import { FileTree } from '@/widgets/file-tree';
import Link from 'next/link';

const codeExample = `
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';

const DashboardPage = dynamic(
  () => import('@/views/dashboard').then((mod) => mod.DashboardPage),
  {
    loading: () => <Skeleton className="h-screen w-full" />,
    ssr: false, 
  }
);

export default DashboardPage;
`;

const middlewareExample = `
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  // Если сессии нет, а путь не публичный - редирект на /auth
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Если сессия есть, а пользователь на странице входа - редирект на /dashboard
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
`;


export function ArchitecturePage() {
    return (
        <div className="prose dark:prose-invert max-w-none opacity-0 animate-fade-in-up">
            <h1>Архитектура Проекта "ProDvor" (Feature-Sliced Design)</h1>
            <p className="lead">Этот документ является основным техническим руководством для разработчиков фронтенд-части платформы "ProDvor" и описывает внедренную архитектурную методологию **Feature-Sliced Design (FSD)**.</p>

            <h2>1. Обзор методологии FSD</h2>
            <p>Feature-Sliced Design — это архитектурная методология для фронтенд-приложений, которая структурирует код по бизнес-областям, а не по техническому назначению. Основная цель — сделать проект управляемым, масштабируемым и понятным для команды.</p>
            <ul>
                <li><strong>Модульность:</strong> Код сгруппирован по функциональным частям (слайсам).</li>
                <li><strong>Низкая связанность:</strong> Модули минимально зависят друг от друга.</li>
                <li><strong>Высокая сплоченность:</strong> Код внутри модуля максимально связан по смыслу.</li>
                <li><strong>Контролируемые зависимости:</strong> Строгие правила импорта между слоями.</li>
            </ul>

            <h2>2. Структура слоев</h2>
            <p>Проект "ProDvor" строго следует иерархии слоев FSD. Каждый слой имеет свое назначение, и импорты разрешены только от верхних слоев к нижним (например, <code>widgets</code> может импортировать из <code>features</code>, но не наоборот).</p>
            
            <FileTree />

            <h2>3. Детальное описание слоев</h2>
             <dl>
                <dt><code>/app</code></dt>
                <dd>Самый верхний слой. Отвечает за инициализацию приложения, роутинг (App Router), глобальные стили и подключение глобальных провайдеров контекста.</dd>
                
                <dt><code>/views</code></dt>
                <dd>Компоненты страниц. Их единственная задача — собрать вместе виджеты, фичи и сущности для формирования конкретной страницы. Они не содержат собственной бизнес-логики.</dd>
                
                <dt><code>/widgets</code></dt>
                <dd>Составные, независимые блоки интерфейса. Примеры: <code>Header</code>, <code>Sidebar</code>, <code>TeamRosterWidget</code>. Виджет — это самодостаточный компонент, который может быть переиспользован на разных страницах.</dd>
                
                <dt><code>/features</code></dt>
                <dd>Пользовательские сценарии (User Stories). Это атомарные действия, которые приносят пользу пользователю. Примеры: <code>отправка сообщения</code>, <code>добавление в друзья</code>, <code>генерация аватара</code>. Фича инкапсулирует в себе всю логику для одного действия: кнопку, модальное окно, API-запрос (Server Action) и обработку состояния.</dd>
                
                <dt><code>/entities</code></dt>
                <dd>Бизнес-сущности проекта, такие как <code>User</code>, <code>Team</code>, <code>Match</code>. Слайс сущности содержит всё, что нужно для её отображения и управления: компоненты (<code>UserCard</code>, <code>UserProfile</code>), типы, функции для работы с API, хуки и т.д.</dd>
                
                <dt><code>/shared</code></dt>
                <dd>Переиспользуемый код, полностью отвязанный от бизнес-логики проекта. Здесь находится UI-кит (кнопки, инпуты), общие утилиты, константы, конфигурации и базовые API-инстансы.</dd>
            </dl>
            
            <h2>4. Безопасность и Аутентификация</h2>
            <p>Безопасность является ключевым аспектом платформы. В текущем прототипе реализована базовая система аутентификации на основе cookies, но архитектура заложена под более надежную систему.</p>
            <h3>Middleware</h3>
            <p>Файл <code>src/middleware.ts</code> играет роль пограничного контроля. Он перехватывает все запросы к приложению и выполняет следующие проверки:</p>
            <ul>
                <li>Проверяет наличие у пользователя cookie с сессией.</li>
                <li>Если пользователь не аутентифицирован и пытается получить доступ к защищенной странице, middleware перенаправляет его на страницу входа (<code>/auth</code>).</li>
                <li>Если аутентифицированный пользователь пытается зайти на страницу входа, он будет перенаправлен в личный кабинет (<code>/dashboard</code>).</li>
            </ul>
             <CodeBlock code={middlewareExample} language="tsx" />
             <h3>План для продакшена</h3>
             <p>В продакшн-версии предполагается использование связки **Kong API Gateway** и **Keycloak Identity Provider**. Kong будет проверять JWT-токены перед доступом к API, а Keycloak — управлять пользователями, ролями и процессом входа. Подробнее это описано в <Link href="/documents/backend-documentation">документации бэкенда</Link>.</p>
            
            <h2>5. Правила импорта</h2>
            <p><strong>Золотое правило:</strong> Модуль может импортировать только те модули, что находятся на слоях ниже него. Импорт "вбок" (между слайсами одного слоя) или "вверх" строго запрещен.</p>
            <ul>
                <li>✅ <strong>Правильно:</strong> <code>widget/UserProfile</code> импортирует <code>feature/send-friend-request</code>.</li>
                <li>❌ <strong>Неправильно:</strong> <code>feature/send-friend-request</code> импортирует <code>widget/UserProfile</code>.</li>
                <li>❌ <strong>Неправильно:</strong> <code>feature/send-friend-request</code> импортирует <code>feature/block-user</code>.</li>
                <li>✅ <strong>Правильно:</strong> Любой слой может импортировать из <code>shared</code>.</li>
            </ul>
            <p>Для обеспечения этих правил используются абсолютные импорты с помощью <code>paths</code> в <code>tsconfig.json</code> (e.g., <code>@/entities/user</code>).</p>
            
            <h2>6. Code Splitting и Lazy Loading</h2>
            <p>Для оптимизации производительности мы активно используем динамические импорты для страниц и крупных виджетов с помощью <code>next/dynamic</code>. Это позволяет загружать код компонента только тогда, когда он действительно нужен, уменьшая начальный размер бандла.</p>
            <CodeBlock code={codeExample} language="tsx" />
        </div>
    );
}
