
'use client';

import { useState, useEffect } from 'react';
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
} from "@/shared/ui/sidebar";
import { UserNav } from "@/widgets/user-nav";
import { Logo } from "@/shared/ui/icons";
import {
  Newspaper,
  MessageSquare,
  Users,
  Users2,
  Trophy,
  LifeBuoy,
  Settings,
  ShieldCheck,
  Dumbbell,
  MapPin,
  Search,
  ShoppingCart,
  Handshake,
  DollarSign,
  UserSearch,
} from "lucide-react";
import { BottomNav } from "@/shared/ui/bottom-nav";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { ThemeCustomizer } from "@/shared/ui/theme-customizer";
import { NotificationsPopover } from "@/widgets/notifications-popover";
import { Button } from '@/shared/ui/button';
import { GlobalSearchDialog } from '@/features/global-search/ui/global-search-dialog';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
    user: User;
    children: React.ReactNode;
}

const mainNavItems = [
    { href: "/dashboard", icon: Newspaper, label: "Лента" },
    { href: "/chats", icon: MessageSquare, label: "Сообщения" },
    { href: "/teams", icon: Users, label: "Команды" },
    { href: "/scouting", icon: UserSearch, label: "Поиск игроков" },
    { href: "/friends", icon: Users2, label: "Друзья" },
    { href: "/tournaments", icon: Trophy, label: "Соревнования" },
    { href: "/training", icon: Dumbbell, label: "Тренировки" },
    { href: "/booking", icon: MapPin, label: "Площадки" },
    { href: "/store", icon: ShoppingCart, label: "Магазин" },
];

const secondaryNavItems = [
    { href: "/sponsors", icon: Handshake, label: "Спонсоры" },
    { href: "/monetization", icon: DollarSign, label: "Подписки" },
    { href: "/support", icon: LifeBuoy, label: "Поддержка" },
    { href: "/settings", icon: Settings, label: "Настройки" },
];

function AppFooter() {
    return (
        <footer className="hidden md:block border-t bg-background text-sm">
            <div className="container mx-auto px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Logo and Copyright */}
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
                    </div>

                    {/* Column 2: Links */}
                    <div className="space-y-2">
                        <h4 className="font-semibold">Навигация</h4>
                        <ul className="space-y-1 text-muted-foreground">
                            <li><Link href="/teams" className="hover:text-primary">Команды</Link></li>
                            <li><Link href="/tournaments" className="hover:text-primary">Соревнования</Link></li>
                            <li><Link href="/support" className="hover:text-primary">Поддержка</Link></li>
                        </ul>
                    </div>
                    
                    {/* Column 3: Links */}
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
}

const AppLayoutContent = ({ user, children }: AppLayoutProps) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { state } = useSidebar();
    const pathname = usePathname();

    useEffect(() => {
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
        if (href === '/dashboard' || href === '/') {
            return pathname === '/dashboard' || pathname === '/';
        }
        return pathname.startsWith(href);
    }

    return (
        <>
            <Sidebar>
                <SidebarContent className="p-2">
                <SidebarHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Logo className="h-5 w-5" />
                        </div>
                        {state === 'expanded' && <div className="font-headline text-lg font-semibold">ProDvor</div>}
                    </Link>
                </SidebarHeader>
                <SidebarMenu>
                    {mainNavItems.map(item => (
                        <SidebarMenuItem key={item.href}>
                             <SidebarMenuButton asChild tooltip={item.label} variant={isActive(item.href) ? 'active' : 'default'}>
                                <Link href={item.href}><item.icon />{state === 'expanded' && <span>{item.label}</span>}</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    <div className="mt-auto">
                        <SidebarSeparator className="my-1" />
                        {user.role === 'Администратор' && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Админка" variant={isActive('/administration') ? 'active' : 'default'}>
                                    <Link href="/administration"><ShieldCheck />{state === 'expanded' && <span>Админка</span>}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {secondaryNavItems.map(item => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild tooltip={item.label} variant={isActive(item.href) ? 'active' : 'default'}>
                                    <Link href={item.href}><item.icon />{state === 'expanded' && <span>{item.label}</span>}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </div>
                </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex flex-col min-h-screen">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
                    <SidebarTrigger className="flex md:hidden" />
                    <div className="flex-1">
                        <Button variant="outline" className="w-full justify-start text-muted-foreground sm:w-auto" onClick={() => setIsSearchOpen(true)}>
                            <Search className="mr-2 h-4 w-4" />
                            <span>Поиск...</span>
                            <kbd className="pointer-events-none ml-4 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </Button>
                    </div>
                    <NotificationsPopover />
                    <ThemeCustomizer />
                    <ThemeToggle />
                    <UserNav user={user} />
                </header>
                <main className="flex-1 overflow-auto p-4 pb-20 sm:p-6 md:pb-6">{children}</main>
                <AppFooter />
                <BottomNav />
            </SidebarInset>
            <GlobalSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
        </>
    );
}

export function AppLayout({ user, children }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <AppLayoutContent user={user}>
                {children}
            </AppLayoutContent>
        </SidebarProvider>
    );
}
