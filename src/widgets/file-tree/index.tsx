import { Folder, File } from 'lucide-react';

const treeData = [
    { name: 'src', type: 'folder' as const, children: [
        { name: 'app', type: 'folder' as const, children: [
            { name: '(app)', type: 'folder' as const, description: 'Группа роутов для защищенных страниц' },
            { name: 'api', type: 'folder' as const, description: 'API роуты Next.js' },
            { name: 'globals.css', type: 'file' as const, description: 'Глобальные стили' },
            { name: 'layout.tsx', type: 'file' as const, description: 'Корневой layout' },
        ]},
        { name: 'views', type: 'folder' as const, description: 'Компоненты страниц, собирающие виджеты' },
        { name: 'widgets', type: 'folder' as const, description: 'Составные блоки интерфейса' },
        { name: 'features', type: 'folder' as const, description: 'Пользовательские сценарии (user stories)' },
        { name: 'entities', type: 'folder' as const, description: 'Бизнес-сущности (User, Team)' },
        { name: 'shared', type: 'folder' as const, description: 'Переиспользуемый код (UI-кит, утилиты)' },
    ]}
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
