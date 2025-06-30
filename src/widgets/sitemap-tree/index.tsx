
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
        { name: 'Лента (Dashboard)', type: 'file', href: '/dashboard' },
        { name: 'Команды', type: 'folder', children: [
            { name: 'Список команд', type: 'file', href: '/teams' },
            { name: 'Создание команды', type: 'file', href: '/teams/new' },
            { name: 'Профиль команды', type: 'file', href: '/teams/cyber-eagles' },
            { name: 'Управление командой', type: 'file', href: '/teams/cyber-eagles/management' },
        ]},
        { name: 'Соревнования', type: 'folder', children: [
            { name: 'Список турниров', type: 'file', href: '/tournaments' },
            { name: 'Создание турнира', type: 'file', href: '/tournaments/new' },
            { name: 'Профиль турнира', type: 'file', href: '/tournaments/summer-kickoff-2024' },
        ]},
        { name: 'Тренировки', type: 'folder', children: [
            { name: 'Центр тренировок', type: 'file', href: '/training' },
            { name: 'Программы', type: 'file', href: '/training/programs' },
            { name: 'Создание программы', type: 'file', href: '/training/programs/new' },
            { name: 'Каталог упражнений', type: 'file', href: '/training/exercises' },
            { name: 'Дневник тренировок', type: 'file', href: '/training/log' },
            { name: 'Аналитика', type: 'file', href: '/training/analytics' },
            { name: 'Центр питания', type: 'file', href: '/training/nutrition' },
            { name: 'Дневник питания', type: 'file', href: '/training/nutrition-diary' },
        ]},
        { name: 'Социальные', type: 'folder', children: [
            { name: 'Сообщения', type: 'file', href: '/chats' },
            { name: 'Друзья', type: 'file', href: '/friends' },
            { name: 'Поиск игроков', type: 'file', href: '/scouting' },
            { name: 'Таблицы лидеров', type: 'file', href: '/leaderboards' },
        ]},
        { name: 'Платформа', type: 'folder', children: [
             { name: 'Магазин', type: 'file', href: '/store' },
             { name: 'Квесты', type: 'file', href: '/quests' },
             { name: 'Фан-зона', type: 'file', href: '/fan-zone' },
             { name: 'Партнеры и спонсоры', type: 'file', href: '/sponsors' },
             { name: 'Бронирование площадок', type: 'file', href: '/booking' },
        ]},
    ]},
    { name: 'Профиль', type: 'folder', children: [
        { name: 'Мой профиль', type: 'file', href: '/profile' },
        { name: 'Настройки', type: 'file', href: '/settings' },
        { name: 'Поддержка', type: 'file', href: '/support' },
    ]},
    { name: 'Администрирование', type: 'folder', children: [
        { name: 'Панель администратора', type: 'file', href: '/administration' },
        { name: 'Управление пользователями', type: 'file', href: '/administration/users' },
        { name: 'Турниры (CRM)', type: 'file', href: '/administration/tournament-crm/dashboard' },
        { name: 'Очередь модерации', type: 'file', href: '/administration/moderation-queue' },
        { name: 'Экономика PD', type: 'file', href: '/pd-economy' },
        { name: 'Геймификация', type: 'file', href: '/administration/gamification' },
        { name: 'Виды спорта', type: 'file', href: '/administration/sports' },
    ]},
    { name: 'Документация', type: 'folder', children: [
        { name: 'Readme проекта', type: 'file', href: '/documents/project-readme' },
        { name: 'Архитектура', type: 'file', href: '/documents/architecture' },
        { name: 'Видение и принципы', type: 'file', href: '/documents/vision-and-principles' },
        { name: 'Условия использования', type: 'file', href: '/documents/terms-of-use' },
        { name: 'Политика конфиденциальности', type: 'file', href: '/documents/privacy-policy' },
        { name: 'Демо темы', type: 'file', href: '/theme-demo' },
        { name: 'Карта сайта', type: 'file', href: '/administration/sitemap' }
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
