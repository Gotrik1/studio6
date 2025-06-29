
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
    { href: "/friends", icon: Users2, label: "Друзья" },
    { href: "/tournaments", icon: Trophy, label: "Соревнования" },
    { href: "/training", icon: Dumbbell, label: "Тренировки" },
    { href: "/booking", icon: MapPin, label: "Площадки" },
];

const secondaryNavItems = [
    { href: "/support", icon: LifeBuoy, label: "Поддержка" },
    { href: "/settings", icon: Settings, label: "Настройки" },
];

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
                <SidebarMenu className="flex-grow">
                    {mainNavItems.map(item => (
                        <SidebarMenuItem key={item.href}>
                             <SidebarMenuButton asChild tooltip={item.label} variant={isActive(item.href) ? 'active' : 'default'}>
                                <Link href={item.href}><item.icon />{state === 'expanded' && <span>{item.label}</span>}</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                <SidebarMenu>
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
                </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex flex-col">
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
                <div className="flex-1 overflow-auto p-4 pb-20 sm:p-6 md:pb-6">{children}</div>
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
