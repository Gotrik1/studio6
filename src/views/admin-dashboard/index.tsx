
'use client';

import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { 
    Users, 
    ShieldCheck, 
    FolderKanban, 
    BrainCircuit,
    Palette,
    Handshake,
    Trophy,
    Gavel,
    Coins,
    DollarSign,
    ShoppingCart,
    Megaphone,
    Map as MapIcon,
    User,
    Briefcase,
    ClipboardList,
    Heart,
    Shield,
    ShieldAlert,
    FileText
} from 'lucide-react';
import Link from "next/link";

type AdminSectionCardProps = {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
}

const AdminSectionCard = ({ title, description, href, icon: Icon }: AdminSectionCardProps) => (
     <Link href={href} className="block h-full">
        <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-2xl cursor-pointer">
            <CardHeader className="flex-row items-start gap-4 space-y-0 flex-grow pb-4">
                <div className="p-2 bg-muted rounded-md">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    </Link>
);

const managementCards: AdminSectionCardProps[] = [
    { title: "Пользователи и роли", description: "Управление всеми пользователями.", href: "/administration/users", icon: Users },
    { title: "Турниры (CRM)", description: "Полный цикл управления турнирами.", href: "/administration/tournament-crm/dashboard", icon: Trophy },
    { title: "Очередь модерации", description: "Жалобы, споры и инциденты.", href: "/administration/moderation-queue", icon: Gavel },
    { title: "Геймификация", description: "Настройка рангов и квестов.", href: "/administration/gamification", icon: ShieldCheck },
    { title: "Виды спорта", description: "Управление дисциплинами.", href: "/administration/sports", icon: Handshake },
];

const profileCards: AdminSectionCardProps[] = [
    { title: "Профиль Игрока", description: "Пример страницы обычного игрока.", href: "/administration/player", icon: User },
    { title: "Профиль Тренера", description: "Пример страницы тренера.", href: "/administration/coach", icon: ClipboardList },
    { title: "Профиль Судьи", description: "Пример страницы судьи.", href: "/administration/judge", icon: Gavel },
    { title: "Профиль Менеджера", description: "Пример страницы менеджера.", href: "/administration/manager", icon: Briefcase },
    { title: "Профиль Модератора", description: "Пример страницы модератора.", href: "/administration/moderator", icon: Shield },
    { title: "Профиль Организатора", description: "Пример страницы организатора.", href: "/administration/organizer", icon: Megaphone },
    { title: "Профиль Спонсора", description: "Пример страницы спонсора.", href: "/administration/sponsor", icon: Handshake },
    { title: "Профиль Болельщика", description: "Пример страницы болельщика.", href: "/administration/fan", icon: Heart },
    { title: "Профиль Администратора", description: "Пример страницы администратора.", href: "/administration/administrator", icon: ShieldAlert },
];

const contentCards: AdminSectionCardProps[] = [
    { title: "Партнеры", description: "Управление спонсорами и партнерами.", href: "/sponsors", icon: Handshake },
    { title: "Экономика PD", description: "Настройка правил начисления PD.", href: "/pd-economy", icon: Coins },
    { title: "Монетизация", description: "Управление подписками.", href: "/monetization", icon: DollarSign },
    { title: "Магазин", description: "Редактирование товаров в магазине.", href: "/store", icon: ShoppingCart },
    { title: "Промо-акции", description: "Создание и управление акциями.", href: "/promotions", icon: Megaphone },
]

const systemCards: AdminSectionCardProps[] = [
    { title: "Инструменты AI", description: "Демонстрация работы AI-агентов.", href: "/ai-analysis", icon: BrainCircuit },
    { title: "Readme проекта", description: "Обзор проекта, стек, возможности.", href: "/documents/project-readme", icon: FileText },
    { title: "Архитектура", description: "Описание архитектуры FSD.", href: "/documents/architecture", icon: FolderKanban },
    { title: "Демо темы", description: "Просмотр всех UI компонентов.", href: "/theme-demo", icon: Palette },
    { title: "Карта сайта", description: "Обзор всех страниц приложения.", href: "/administration/sitemap", icon: MapIcon },
]

export function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Панель администратора</h1>
                <p className="text-muted-foreground">Обзор и управление всеми разделами платформы ProDvor.</p>
            </div>

            <section>
                <h2 className="font-headline text-2xl font-semibold mb-4">Управление платформой</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {managementCards.map(card => <AdminSectionCard key={card.href} {...card} />)}
                </div>
            </section>
            
            <section>
                <h2 className="font-headline text-2xl font-semibold mb-4">Демонстрация профилей ролей</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profileCards.map(card => <AdminSectionCard key={card.href} {...card} />)}
                </div>
            </section>
            
            <section>
                <h2 className="font-headline text-2xl font-semibold mb-4">Контент и коммерция</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contentCards.map(card => <AdminSectionCard key={card.href} {...card} />)}
                </div>
            </section>
            
             <section>
                <h2 className="font-headline text-2xl font-semibold mb-4">Система и разработка</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {systemCards.map(card => <AdminSectionCard key={card.href} {...card} />)}
                </div>
            </section>
        </div>
    );
}
