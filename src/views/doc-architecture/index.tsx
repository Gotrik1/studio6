
import { CodeBlock } from '@/widgets/code-block';
import { FileTree } from '@/widgets/file-tree';

const codeExample = `
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';

const DashboardPage = dynamic(
  () => import('@/pages/dashboard').then((mod) => mod.DashboardPage),
  {
    loading: () => <Skeleton className="h-screen w-full" />,
    ssr: false, 
  }
);

export default DashboardPage;
`;

export function ArchitecturePage() {
    return (
        <div className="prose dark:prose-invert max-w-none opacity-0 animate-fade-in-up">
            <h1>Архитектура Проекта &quot;ProDvor&quot; (Feature-Sliced Design)</h1>
            <p className="lead">Этот документ является основным техническим руководством для разработчиков фронтенд-части платформы &quot;ProDvor&quot; и описывает внедренную архитектурную методологию **Feature-Sliced Design (FSD)**.</p>

            <h2>1. Обзор методологии FSD</h2>
            <p>Feature-Sliced Design — это архитектурная методология для фронтенд-приложений, которая структурирует код по бизнес-областям, а не по техническому назначению. Основная цель — сделать проект управляемым, масштабируемым и понятным для команды.</p>
            <ul>
                <li><strong>Модульность:</strong> Код сгруппирован по функциональным частям (слайсам).</li>
                <li><strong>Низкая связанность:</strong> Модули минимально зависят друг от друга.</li>
                <li><strong>Высокая сплоченность:</strong> Код внутри модуля максимально связан по смыслу.</li>
                <li><strong>Контролируемые зависимости:</strong> Строгие правила импорта между слоями.</li>
            </ul>

            <h2>2. Структура слоев</h2>
            <p>Проект &quot;ProDvor&quot; строго следует иерархии слоев FSD. Каждый слой имеет свое назначение, и импорты разрешены только от верхних слоев к нижним (например, <code>widgets</code> может импортировать из <code>features</code>, но не наоборот).</p>
            
            <FileTree />

            <h2>3. Правила импорта</h2>
            <p><strong>Золотое правило:</strong> Модуль может импортировать только те модули, что находятся на слоях ниже него. Импорт &quot;вбок&quot; (между слайсами одного слоя) или &quot;вверх&quot; строго запрещен.</p>
            <ul>
                <li>✅ <strong>Правильно:</strong> <code>widget/UserProfile</code> импортирует <code>feature/send-friend-request</code>.</li>
                <li>❌ <strong>Неправильно:</strong> <code>feature/send-friend-request</code> импортирует <code>widget/UserProfile</code>.</li>
                <li>❌ <strong>Неправильно:</strong> <code>feature/send-friend-request</code> импортирует <code>feature/block-user</code>.</li>
                <li>✅ <strong>Правильно:</strong> Любой слой может импортировать из <code>shared</code>.</li>
            </ul>
            <p>Для обеспечения этих правил используются абсолютные импорты с помощью <code>paths</code> в <code>tsconfig.json</code> (e.g., <code>@/entities/user</code>).</p>
            
            <h2>4. Code Splitting и Lazy Loading</h2>
            <p>Для оптимизации производительности мы активно используем динамические импорты для страниц и крупных виджетов с помощью <code>next/dynamic</code>.</p>
            <CodeBlock code={codeExample} language="tsx" />
        </div>
    );
}
