

'use client';

import React from 'react';
import type { User } from "@/shared/lib/types";
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/shared/ui/sidebar";
import { UserNav } from "@/widgets/user-nav";
import { Logo } from "@/shared/ui/icons";
import {
  Newspaper,
  MessageSquare,
  Users,
  Trophy,
  LifeBuoy,
  Settings,
  ShieldCheck,
  Dumbbell,
  Search,
  ShoppingCart,
  Swords,
  ClipboardList,
  Gavel,
  Map,
  Backpack,
  HeartPulse,
  FolderKanban,
  FileText,
  Palette,
  BrainCircuit,
  Coins,
  Ruler,
  Flame,
  Target,
  FileSignature,
  Lock
} from "lucide-react";
import { BottomNav } from "@/shared/ui/bottom-nav";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { ThemeCustomizer } from "@/shared/ui/theme-customizer";
import { NotificationsPopover } from "@/widgets/notifications-popover";
import { Button } from '@/shared/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { HeaderCart } from '@/widgets/header-cart';
import { CartDialog } from '@/widgets/cart-dialog';
import { GlobalSearchDialog } from '@/features/global-search/ui/global-search-dialog';


interface AppLayoutProps {
    user: User;
    children: React.ReactNode;
}

const AppFooter = () => (
    <footer className="hidden md:block bg-background text-sm border-t border-background">
        <div className="container mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Logo className="h-5 w-5" />
                        </div>
                        <div className="font-headline text-lg font-semibold">ProDvor</div>
                    </Link>
                    <p className="text-muted-foreground">
                        © {new Date().getFullYear()} ProDvor. Все права защищены.
                    </p>
                    <p className="text-xs text-muted-foreground/80">Версия 1.0.0 (Прототип)</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold">Навигация</h4>
                    <ul className="space-y-1 text-muted-foreground">
                        <li><Link href="/teams" className="hover:text-primary">Команды</Link></li>
                        <li><Link href="/tournaments" className="hover:text-primary">Соревнования</Link></li>
                        <li><Link href="/support" className="hover:text-primary">Поддержка</Link></li>
                    </ul>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold">Информация</h4>
                        <ul className="space-y-1 text-muted-foreground">
                        <li><Link href="/documents/vision-and-principles" className="hover:text-primary">О проекте</Link></li>
                        <li><Link href="/documents/terms-of-use" className="hover:text-primary">Условия использования</Link></li>
                        <li><Link href="/documents/privacy-policy" className="hover:text-primary">Политика конфиденциальности</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
);


const AppLayoutContent = ({ user, children }: AppLayoutProps) => {
    const { state } = useSidebar();
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const isActive = (href: string) => {
        if (!pathname) return false;
        if (href === '/dashboard' || href === '/') {
            return pathname === '/dashboard' || pathname === '/';
        }
        if (href.length > 1 && pathname.startsWith(href)) {
             if (pathname.length === href.length) return true; // exact match
             if (pathname.charAt(href.length) === '/') return true; // subpath
        }
        return false;
    };

    const mainNavItems = [
        { href: "/dashboard", icon: Newspaper, label: "Лента" },
        { href: "/teams", icon: Users, label: "Команды" },
        { href: "/tournaments", icon: Trophy, label: "Турниры" },
        { href: "/leagues", icon: Flame, label: "Лиги" },
        { href: "/challenges", icon: Target, label: "Вызовы" },
        { href: "/lfg", icon: Swords, label: "Поиск игры" },
        { href: "/chats", icon: MessageSquare, label: "Сообщения" },
        { href: "/training", icon: Dumbbell, label: "Тренировки" },
        { href: "/playgrounds", icon: Map, label: "Площадки" },
        { href: "/inventory", icon: Backpack, label: "Инвентарь" },
        { href: "/store", icon: ShoppingCart, label: "Магазин" },
        { href: "/quests", icon: ShieldCheck, label: "Квесты" },
    ];

    const adminNavItems = {
        label: "Администрирование",
        icon: ShieldCheck,
        href: '/administration',
        role: 'Администратор',
        children: [
            { href: "/administration/users", label: "Пользователи" },
            { href: "/administration/tournament-crm/dashboard", label: "Турниры (CRM)" },
            { href: "/administration/moderation-queue", label: "Очередь модерации" },
            { href: "/administration/pd-economy", label: "Экономика PD" },
            { href: "/administration/gamification", label: "Геймификация" },
            { href: "/administration/sports", label: "Виды спорта" },
        ]
    };
    
    const docsNavItems = {
        label: "Документация",
        icon: FolderKanban,
        href: '/documents',
        role: 'Администратор', // Assuming docs are also for admin
        children: [
            { href: "/documents/project-readme", label: "Readme проекта" },
            { href: "/documents/architecture", label: "Архитектура" },
            { href: "/documents/backend-documentation", label: "Бэкенд-документация" },
            { href: "/documents/backend-roadmap", label: "Backend Roadmap", icon: FileSignature },
            { href: "/documents/vision-and-principles", label: "Видение проекта" },
            { href: "/documents/auth-implementation", label: "План Аутентификации", icon: FileSignature },
            { href: "/ai-analysis", icon: BrainCircuit, label: "AI-Песочница" },
            { href: "/theme-demo", icon: Palette, label: "Демо темы" },
            { href: "/administration/sitemap", icon: Map, label: "Карта сайта" },
        ]
    };

    const systemNavItems = [
        { href: "/support", icon: LifeBuoy, label: "Поддержка" },
        { href: "/settings", icon: Settings, label: "Настройки" },
    ];

    const renderCollapsibleMenu = (item: typeof adminNavItems) => (
         <SidebarMenuItem key={item.label}>
            <Collapsible>
                <CollapsibleTrigger className="w-full">
                    <SidebarMenuButton asChild tooltip={item.label} variant={isActive(item.href) ? 'active' : 'default'} className="w-full">
                        <Link href={item.href}><item.icon />{state === 'expanded' && <span>{item.label}</span>}</Link>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                {state === 'expanded' && (
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.children.map(child => (
                                <SidebarMenuSubItem key={child.href}>
                                    <SidebarMenuSubButton href={child.href} variant={isActive(child.href) ? 'active' : 'default'}>
                                        {child.icon && <child.icon className="mr-2 h-4 w-4"/>}
                                        {child.label}
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                )}
            </Collapsible>
        </SidebarMenuItem>
    );

    return (
        <>
            <Sidebar>
                <SidebarContent className="p-2 flex flex-col">
                    <SidebarHeader>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Logo className="h-5 w-5" />
                            </div>
                            {state === 'expanded' && <div className="font-headline text-lg font-semibold">ProDvor</div>}
                        </Link>
                    </SidebarHeader>
                    <div className="flex-1 overflow-y-auto">
                        <SidebarMenu className="space-y-1">
                            {mainNavItems.map(item => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild tooltip={item.label} variant={isActive(item.href) ? 'active' : 'default'}>
                                        <Link href={item.href}><item.icon />{state === 'expanded' && <span>{item.label}</span>}</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            
                            {user.role === 'Тренер' && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Тренерский центр" variant={isActive('/coach-center') ? 'active' : 'default'}>
                                        <Link href="/coach-center"><ClipboardList />{state === 'expanded' && <span>Тренерский центр</span>}</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            
                            {user.role === 'Судья' && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Центр судейства" variant={isActive('/judge-center') ? 'active' : 'default'}>
                                        <Link href="/judge-center"><Gavel />{state === 'expanded' && <span>Центр судейства</span>}</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </div>
                    <div className="pt-2 mt-auto">
                        <SidebarSeparator className="my-1" />
                        {user.role === 'Администратор' && renderCollapsibleMenu(adminNavItems)}
                        {user.role === 'Администратор' && renderCollapsibleMenu(docsNavItems)}

                        {systemNavItems.map(item => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild tooltip={item.label} variant={isActive(item.href) ? 'active' : 'default'}>
                                    <Link href={item.href}><item.icon />{state === 'expanded' && <span>{item.label}</span>}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </div>
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex flex-col min-h-screen">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-background bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
                    <SidebarTrigger className="flex md:hidden" />
                    <div className="flex-1">
                        <Button variant="outline" className="w-full justify-start text-muted-foreground sm:w-auto" onClick={() => setIsSearchOpen(true)}>
                            <Search className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Поиск...</span>
                            <kbd className="pointer-events-none ml-4 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </Button>
                    </div>
                    <HeaderCart />
                    <NotificationsPopover />
                    <ThemeCustomizer />
                    <ThemeToggle />
                    <UserNav user={user} />
                </header>
                <main className="flex-1 overflow-auto p-4 sm:p-6 md:pb-6">{children}</main>
                <AppFooter />
                <BottomNav />
            </SidebarInset>
            <GlobalSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
            <CartDialog />
        </>
    );
};

export function AppLayout({ user, children }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <AppLayoutContent user={user}>
                {children}
            </AppLayoutContent>
        </SidebarProvider>
    );
}
