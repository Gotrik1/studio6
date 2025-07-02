
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { FileTree } from '@/widgets/file-tree';
import { CodeBlock } from '@/widgets/code-block';
import {
  GitCommit,
  Layers,
  Shield,
  Library,
  TestTube2,
  UploadCloud,
  Cpu,
  Fingerprint,
  Users,
  Trophy,
} from 'lucide-react';

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

const Section = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <section className="space-y-4 pt-8">
    <h2 className="flex items-center gap-3 font-headline text-3xl font-bold tracking-tight">
      <Icon className="h-8 w-8 text-primary" />
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </section>
);

export function ArchitecturePage() {
  return (
    <div className="prose dark:prose-invert max-w-none opacity-0 animate-fade-in-up">
      <h1>Техническая Документация Проекта "ProDvor"</h1>
      <p className="lead">
        Версия: 1.3 | Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
      </p>
      <p>
        Этот документ является основным техническим руководством для
        разработчиков фронтенд-части платформы "ProDvor". Он описывает
        архитектуру, технологический стек, стандарты кодирования и ключевые
        принятые решения.
      </p>

      <Section title="1. Введение" icon={Layers}>
        <h3>1.1. Общее описание продукта</h3>
        <p>
          ProDvor — это социальная веб-платформа, предназначенная для
          объединения участников дворового и любительского спорта. Она
          предоставляет инструменты для создания профилей, команд, организации
          турниров и ведения спортивной жизни онлайн.
        </p>

        <h3>1.2. Термины и сокращения</h3>
        <ul className="list-disc list-inside">
            <li><strong>FSD (Feature-Sliced Design)</strong> — основная архитектурная методология проекта.</li>
            <li><strong>RSC (React Server Components)</strong> — серверные компоненты React, используемые по умолчанию.</li>
            <li><strong>ADR (Architecture Decision Record)</strong> — запись об архитектурном решении.</li>
            <li><strong>NFR (Non-Functional Requirements)</strong> — нефункциональные требования.</li>
            <li><strong>API</strong> — интерфейс взаимодействия с бэкендом.</li>
        </ul>
      </Section>

      <Section title="2. Требования к фронтенду" icon={Cpu}>
        <Card>
          <CardHeader>
            <CardTitle>2.1. Требования к платформе</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li><strong>Фреймворк:</strong> Next.js 15.3+ (App Router).</li>
              <li><strong>Язык:</strong> TypeScript.</li>
              <li><strong>Сборщик:</strong> Turbopack (в режиме разработки).</li>
              <li><strong>Стилизация:</strong> Tailwind CSS.</li>
              <li><strong>UI-компоненты:</strong> ShadCN UI.</li>
              <li><strong>AI-функциональность:</strong> Genkit.</li>
            </ul>
          </CardContent>
        </Card>
        
        <h3>2.2. Безопасность</h3>
        <p>Аутентификация в прототипе реализована через `httpOnly` cookie, которые устанавливаются после успешного входа. Middleware (`src/middleware.ts`) защищает все маршруты, кроме публичных. В продакшен-версии планируется переход на JWT-токены и связку Kong + Keycloak, как описано в <Link href="/documents/backend-documentation">документации бэкенда</Link>.</p>
        <CodeBlock code={middlewareExample} language="tsx" />
      </Section>
      
      <Section title="3. FSD-структура проекта" icon={Library}>
         <h3>3.1. Описание слоев</h3>
        <p>Проект строго следует иерархии слоев Feature-Sliced Design. Импорты разрешены только от верхних слоев к нижним (например, `widgets` может импортировать из `features`, но не наоборот).</p>
        <FileTree />
        <h3>3.2. Правила взаимодействия</h3>
        <p><strong>Золотое правило:</strong> Модуль может импортировать только те модули, что находятся на слоях ниже него. Импорт "вбок" (между слайсами одного слоя) или "вверх" строго запрещен.</p>
        <ul className="list-disc list-inside">
            <li>✅ <strong>Правильно:</strong> <code>widget/UserProfile</code> импортирует <code>feature/send-friend-request</code>.</li>
            <li>❌ <strong>Неправильно:</strong> <code>feature/send-friend-request</code> импортирует <code>widget/UserProfile</code>.</li>
            <li>❌ <strong>Неправильно:</strong> <code>feature/send-friend-request</code> импортирует <code>feature/block-user</code>.</li>
        </ul>
        <p>Для обеспечения этих правил используются абсолютные импорты с помощью `paths` в `tsconfig.json`.</p>
      </Section>
      
      <Section title="4. Функциональные спецификации" icon={Fingerprint}>
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Trophy /> Система Очков и Рейтингов</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Платформа использует систему очков опыта (XP) для отражения вовлеченности пользователя. Очки начисляются за различные действия: победы в матчах, создание команды, выполнение квестов. Накопленные XP определяют ранг пользователя на платформе.</p>
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><Users /> Система Достижений и Верификации</CardTitle>
          </CardHeader>
          <CardContent>
            <p>В текущем прототипе система достижений основана на доверии — пользователь сам отмечает выполнение. В будущем планируется внедрение системы верификации сообществом для подтверждения реальных спортивных достижений.</p>
          </CardContent>
        </Card>
      </Section>
      
      <Section title="5. Записи об архитектурных решениях (ADR)" icon={GitCommit}>
        <Card>
            <CardHeader><CardTitle>ADR-001: Выбор Feature-Sliced Design (FSD)</CardTitle></CardHeader>
            <CardContent>
                <p><strong>Решение:</strong> Использовать методологию FSD для организации кодовой базы.</p>
                <p><strong>Обоснование:</strong> FSD обеспечивает масштабируемость, низкую связанность модулей и предсказуемость структуры, что критически важно для крупного проекта. Это упрощает командную работу и поддержку кода в долгосрочной перспективе.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>ADR-002: Выбор технологического стека</CardTitle></CardHeader>
            <CardContent>
                <p><strong>Решение:</strong> Использовать связку Next.js (App Router) + TypeScript + Tailwind CSS + ShadCN UI.</p>
                <p><strong>Обоснование:</strong> Этот стек является современным стандартом для создания производительных и надежных React-приложений, обеспечивая отличный DX и типизацию.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>ADR-003: Использование Genkit для AI-функциональности</CardTitle></CardHeader>
            <CardContent>
                <p><strong>Решение:</strong> Использовать Genkit от Google в качестве основного инструмента для разработки AI-фичей.</p>
                <p><strong>Обоснование:</strong> Genkit предоставляет единый API для работы с различными моделями, имеет хорошую интеграцию с Next.js и позволяет создавать сложную, но управляемую логику для ИИ-агентов.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>ADR-004: Выбор Kafka в качестве брокера сообщений</CardTitle></CardHeader>
            <CardContent>
                <p><strong>Решение:</strong> Для бэкенда выбран Apache Kafka.</p>
                <p><strong>Обоснование:</strong> С учетом требований на поддержку 80 млн. пользователей и стримингового функционала, Kafka является единственным решением, обеспечивающим необходимую масштабируемость и пропускную способность. Подробнее — в <Link href="/documents/backend-documentation">документации бэкенда</Link>.</p>
            </CardContent>
        </Card>
      </Section>
    </div>
  );
}
