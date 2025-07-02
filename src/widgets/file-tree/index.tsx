import { Folder, File } from 'lucide-react';

const treeData = [
    { name: 'src', type: 'folder' as const, children: [
        { name: 'app', type: 'folder' as const, children: [
            { name: '(app)', type: 'folder' as const, description: 'Группа роутов для защищенных страниц (dashboard, profile, etc.)' },
            { name: 'auth', type: 'folder' as const, description: 'Страница входа и регистрации' },
            { name: 'api', type: 'folder' as const, description: 'API роуты Next.js (e.g. /api/session)' },
            { name: 'providers', type: 'folder' as const, description: 'Глобальные React Context провайдеры' },
            { name: 'globals.css', type: 'file' as const, description: 'Глобальные стили и переменные Tailwind' },
            { name: 'layout.tsx', type: 'file' as const, description: 'Корневой layout приложения (html, body)' },
        ]},
        { name: 'views', type: 'folder' as const, description: 'Компоненты страниц, собирающие виджеты (e.g., DashboardPage)' },
        { name: 'widgets', type: 'folder' as const, description: 'Составные блоки интерфейса (e.g., Sidebar, TeamChat, PollCard)' },
        { name: 'features', type: 'folder' as const, description: 'Пользовательские сценарии (e.g., user-avatar-generator, report-player)' },
        { name: 'entities', type: 'folder' as const, description: 'Бизнес-сущности (User, Team, Match) и их UI-представления' },
        { name: 'shared', type: 'folder' as const, children: [
            { name: 'api', type: 'folder' as const, description: 'Общие API-инстансы и Genkit-флоу' },
            { name: 'config', type: 'folder' as const, description: 'Конфигурационные файлы (e.g., ranks)' },
            { name: 'hooks', type: 'folder' as const, description: 'Переиспользуемые React-хуки' },
            { name: 'lib', type: 'folder' as const, description: 'Общие утилиты и хелперы (cn, mock-data)' },
            { name: 'ui', type: 'folder' as const, description: 'UI-кит (Button, Card, Input) на базе ShadCN' },
        ]},
    ]},
    { name: 'middleware.ts', type: 'file' as const, description: 'Проверка аутентификации для всех запросов' },
    { name: 'tailwind.config.ts', type: 'file' as const, description: 'Конфигурация Tailwind CSS' },
    { name: 'next.config.ts', type: 'file' as const, description: 'Конфигурация Next.js' },
    { name: 'package.json', type: 'file' as const, description: 'Зависимости и скрипты проекта' },
];

type TreeNode = {
    name: string;
    type: 'folder' | 'file';
    description?: string;
    children?: TreeNode[];
};

const TreeItem = ({ item, level }: { item: TreeNode, level: number }) => (
    <div style={{ marginLeft: `${level * 20}px` }} className="flex flex-col">
        <div className="flex items-center gap-2 py-1">
            {item.type === 'folder' ? <Folder className="h-4 w-4 text-primary" /> : <File className="h-4 w-4 text-muted-foreground" />}
            <span className="font-mono font-semibold">{item.name}</span>
            {item.description && <span className="text-sm text-muted-foreground">- {item.description}</span>}
        </div>
        {item.children && item.children.map(child => <TreeItem key={child.name} item={child} level={level + 1} />)}
    </div>
);


export function FileTree() {
    return (
        <div className="not-prose rounded-lg border bg-card p-4">
            {treeData.map(item => <TreeItem key={item.name} item={item} level={0} />)}
        </div>
    );
}
