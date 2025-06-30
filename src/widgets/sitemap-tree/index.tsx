
'use client';

import { Folder, File } from 'lucide-react';
import Link from 'next/link';

type TreeNode = {
    name: string;
    type: 'folder' | 'file';
    href?: string;
    children?: TreeNode[];
};

const sitemapData: TreeNode[] = [
    { name: 'Основное', type: 'folder', children: [
        { name: 'Лента', type: 'file', href: '/dashboard' },
        { name: 'Сообщения', type: 'file', href: '/chats' },
        { name: 'Команды', type: 'file', href: '/teams' },
        { name: 'Друзья', type: 'file', href: '/friends' },
        { name: 'Соревнования', type: 'file', href: '/tournaments' },
        { name: 'Тренировки', type: 'file', href: '/training' },
        { name: 'Площадки', type: 'file', href: '/booking' },
    ]},
    { name: 'Профиль и настройки', type: 'folder', children: [
        { name: 'Мой профиль', type: 'file', href: '/profile' },
        { name: 'Настройки', type: 'file', href: '/settings' },
        { name: 'Поддержка', type: 'file', href: '/support' },
    ]},
    { name: 'Администрирование', type: 'folder', children: [
        { name: 'Панель администратора', type: 'file', href: '/administration' },
        { name: 'Управление пользователями', type: 'file', href: '/administration/users' },
        { name: 'Управление турнирами', type: 'file', href: '/administration/tournament-crm/dashboard' },
        { name: 'Модерация', type: 'file', href: '/administration/moderation-queue' },
        { name: 'Геймификация', type: 'file', href: '/administration/gamification' },
        { name: 'Документация', type: 'folder', children: [
            { name: 'Readme проекта', type: 'file', href: '/documents/project-readme' },
            { name: 'Архитектура', type: 'file', href: '/documents/architecture' },
            { name: 'Backend Roadmap', type: 'file', href: '/documents/backend-roadmap' },
            { name: 'Backend Production', type: 'file', href: '/documents/backend-production' },
            { name: 'Видение проекта', type: 'file', href: '/documents/vision-and-principles' }
        ]},
    ]},
];

const TreeItem = ({ item, level }: { item: TreeNode, level: number }) => {
    const content = (
         <div className="flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors hover:bg-muted">
            {item.type === 'folder' ? <Folder className="h-4 w-4 text-primary" /> : <File className="h-4 w-4 text-muted-foreground" />}
            <span className="font-medium">{item.name}</span>
        </div>
    );
    
    return (
        <div style={{ marginLeft: `${level * 24}px` }} className="flex flex-col">
            {item.href ? <Link href={item.href}>{content}</Link> : content}
            {item.children && (
                <div className="border-l-2 ml-2 pl-2">
                    {item.children.map(child => <TreeItem key={child.name} item={child} level={level + 1} />)}
                </div>
            )}
        </div>
    );
};


export function SitemapTree() {
    return (
        <div className="space-y-2">
            {sitemapData.map(item => <TreeItem key={item.name} item={item} level={0} />)}
        </div>
    );
}
