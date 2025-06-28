'use client';

export default function ArchitecturePage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-card text-card-foreground rounded-lg shadow-sm">
      <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert max-w-none space-y-6">
        <h1 className="font-headline text-4xl font-bold border-b pb-2">Архитектура Проекта "ProDvor" (Feature-Sliced Design)</h1>
        
        <section>
          <p><strong>Версия:</strong> 2.0</p>
          <p><strong>Дата последнего обновления:</strong> 28.07.2024</p>
          <p className="mt-4 text-muted-foreground">Этот документ является основным техническим руководством для разработчиков фронтенд-части платформы "ProDvor" и описывает внедренную архитектурную методологию <strong>Feature-Sliced Design (FSD)</strong>.</p>
        </section>
        
        <hr />

        <section>
          <h2 className="font-headline text-3xl font-bold">1. Обзор методологии FSD</h2>
          <p>Feature-Sliced Design — это архитектурная методология для фронтенд-приложений, которая структурирует код по бизнес-областям, а не по техническому назначению. Основная цель — сделать проект управляемым, масштабируемым и понятным для команды.</p>
          <p>Ключевые принципы FSD:</p>
          <ul>
            <li><strong>Модульность:</strong> Код сгруппирован по функциональным частям (слайсам).</li>
            <li><strong>Низкая связанность:</strong> Модули минимально зависят друг от друга.</li>
            <li><strong>Высокая сплоченность:</strong> Код внутри модуля максимально связан по смыслу.</li>
            <li><strong>Контролируемые зависимости:</strong> Строгие правила импорта между слоями.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2 className="font-headline text-3xl font-bold">2. Структура слоев</h2>
          <p>Проект "ProDvor" строго следует иерархии слоев FSD. Каждый слой имеет свое назначение, и импорты разрешены только от верхних слоев к нижним (например, <code>widgets</code> может импортировать из <code>features</code>, но не наоборот).</p>
          
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-bold">7. <code>app</code> — Приложение</h4>
              <p className="text-sm text-muted-foreground">Инициализация приложения: настройка роутинга, глобальные стили, провайдеры (темы, сессии).</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-bold">6. <code>pages</code> — Страницы</h4>
              <p className="text-sm text-muted-foreground">Композиция виджетов и фич для формирования конкретных страниц. Здесь не должно быть логики.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-bold">5. <code>widgets</code> — Виджеты</h4>
              <p className="text-sm text-muted-foreground">Составные, независимые блоки интерфейса (например, <code>Header</code>, <code>UserProfile</code>, <code>TeamRoster</code>). Собираются из фич и сущностей.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-bold">4. <code>features</code> — Функциональность</h4>
              <p className="text-sm text-muted-foreground">Пользовательские сценарии (user stories). Например, <code>send-message</code>, <code>add-to-friends</code>, <code>login-form</code>. Имеют бизнес-логику и взаимодействуют с API.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-bold">3. <code>entities</code> — Бизнес-сущности</h4>
              <p className="text-sm text-muted-foreground">Бизнес-модели и компоненты для их отображения (например, <code>User</code>, <code>Team</code>, <code>Match</code>). Карточка пользователя (<code>UserCard</code>) — типичный пример.</p>
            </div>
             <div className="rounded-lg border p-4">
              <h4 className="font-bold">2. <code>processes</code> — Процессы (Опционально)</h4>
              <p className="text-sm text-muted-foreground">Сценарии, охватывающие несколько страниц (например, процесс онбординга или оплаты). В текущей реализации используется минимально.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-bold">1. <code>shared</code> — Переиспользуемый код</h4>
              <p className="text-sm text-muted-foreground">Самый нижний слой. Содержит UI-кит (кнопки, инпуты), утилиты (<code>cn</code>), хелперы, типы и моковые данные. Не содержит бизнес-логики.</p>
            </div>
          </div>
        </section>

        <hr />
        
        <section>
            <h2 className="font-headline text-3xl font-bold">3. Правила импорта</h2>
            <p><strong>Золотое правило:</strong> Модуль может импортировать только те модули, что находятся на слоях ниже него. Импорт "вбок" (между слайсами одного слоя) или "вверх" строго запрещен.</p>
            <ul>
                <li>✅ <strong>Правильно:</strong> <code>widget/UserProfile</code> импортирует <code>feature/send-friend-request</code>.</li>
                <li>❌ <strong>Неправильно:</strong> <code>feature/send-friend-request</code> импортирует <code>widget/UserProfile</code>.</li>
                <li>❌ <strong>Неправильно:</strong> <code>feature/send-friend-request</code> импортирует <code>feature/block-user</code>.</li>
                <li>✅ <strong>Правильно:</strong> Любой слой может импортировать из <code>shared</code>.</li>
            </ul>
        </section>

        <hr />

        <section>
            <h2 className="font-headline text-3xl font-bold">4. Code Splitting и Lazy Loading</h2>
            <p>Для оптимизации производительности и уменьшения времени начальной загрузки (TBT, FCP) мы активно используем динамические импорты. Это особенно важно для сложных страниц и виджетов.</p>
            <p>В проекте это реализуется с помощью функции <code>dynamic</code> из Next.js:</p>
            <pre><code className="language-tsx">{`import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Ленивая загрузка виджета профиля
const JudgeProfile = dynamic(() => import('@/components/judge-profile').then(mod => mod.JudgeProfile), {
  loading: () => <Skeleton className="h-96 w-full" />, // Отображается во время загрузки
  ssr: false, // Отключаем рендеринг на сервере для этого компонента
});

export default function JudgeProfilePage() {
  return <JudgeProfile />;
}
`}</code></pre>
            <p>Такой подход применяется ко всем страницам и крупным виджетам (например, профили, дашборды, тяжелые модальные окна), которые не являются критически важными для первого рендера.</p>
        </section>


        <style jsx>{`
          .prose h1 { margin-bottom: 1rem; }
          .prose h2 { margin-top: 2rem; margin-bottom: 1rem; }
          .prose h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; }
          .prose h4 { margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600; }
          .prose p, .prose ul { margin-bottom: 1rem; }
          .prose ul { list-style-position: inside; list-style-type: disc; padding-left: 1rem; }
          .prose hr { border-color: hsl(var(--border)); margin-top: 2rem; margin-bottom: 2rem; }
          .prose pre {
            background-color: hsl(var(--muted));
            color: hsl(var(--muted-foreground));
            padding: 1rem;
            border-radius: 0.5rem;
          }
          .prose code:not(pre > code) {
            background-color: hsl(var(--muted)); 
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            border-radius: 6px;
          }
        `}</style>
      </article>
    </div>
  )
}
