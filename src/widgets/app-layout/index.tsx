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
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
} from "@/shared/ui/sidebar";
import { UserNav } from "@/widgets/user-nav";
import { Logo } from "@/shared/ui/icons";
import {
  Newspaper,
  User as UserIcon,
  Users,
  Search,
  Trophy,
  Award,
  LifeBuoy,
  Settings,
  FolderKanban,
  Shield,
  BrainCircuit,
  Palette,
  Gamepad2,
  ListChecks,
  Scale,
  Handshake,
} from "lucide-react";
import { CollapsibleSidebarMenuItem } from "./collapsible-sidebar-menu-item";
import { BottomNav } from "@/widgets/bottom-nav";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { ThemeCustomizer } from "@/shared/ui/theme-customizer";
import { NotificationsPopover } from "@/widgets/notifications-popover";
import { Button } from '@/shared/ui/button';
import { GlobalSearchDialog } from '@/features/global-search/ui/global-search-dialog';

interface AppLayoutProps {
    user: User;
    children: React.ReactNode;
}

export function AppLayout({ user, children }: AppLayoutProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent className="p-2">
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Logo className="h-5 w-5" />
                    </div>
                    <div className="font-headline text-lg font-semibold">ProDvor</div>
                    </div>
                </SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Лента">
                          <Link href="/dashboard"><Newspaper />Лента</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Мой профиль">
                          <Link href="/profile"><UserIcon />Мой профиль</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarSeparator className="my-1" />

                    <CollapsibleSidebarMenuItem icon={<Users />} title="Сообщество">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/teams">Команды</SidebarMenuSubButton>
                        <SidebarMenuSubButton href="/chats">Чаты</SidebarMenuSubButton>
                        <SidebarMenuSubButton href="/friends">Друзья</SidebarMenuSubButton>
                        <SidebarMenuSubButton href="/fan-zone">Фан-зона</SidebarMenuSubButton>
                        <SidebarMenuSubButton href="/partners">Партнеры</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </CollapsibleSidebarMenuItem>

                    <CollapsibleSidebarMenuItem icon={<Trophy />} title="Соревнования">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/matches">Матчи</SidebarMenuSubButton>
                        <SidebarMenuSubButton href="/tournaments">Турниры</SidebarMenuSubButton>
                        <SidebarMenuSubButton href="/leaderboards">Лидерборды</SidebarMenuSubButton>
                        <SidebarMenuSubButton href="/booking">Площадки</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </CollapsibleSidebarMenuItem>

                    <CollapsibleSidebarMenuItem icon={<BrainCircuit />} title="Развитие">
                      <SidebarMenuSubItem>
                          <SidebarMenuSubButton href="/training">AI-Коуч</SidebarMenuSubButton>
                          <SidebarMenuSubButton href="/quests">Квесты</SidebarMenuSubButton>
                          <SidebarMenuSubButton href="/store">Магазин</SidebarMenuSubButton>
                          <SidebarMenuSubButton href="/promotions">Промо-акции</SidebarMenuSubButton>
                          <SidebarMenuSubButton href="/pd-economy">Экономика PD</SidebarMenuSubButton>
                          <SidebarMenuSubButton href="/monetization">Монетизация</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </CollapsibleSidebarMenuItem>

                    <CollapsibleSidebarMenuItem icon={<Award />} title="Роли">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/judge-center">Центр Судей</SidebarMenuSubButton>
                        <SidebarMenuSubButton href="/sponsors">Спонсоры</SidebarMenuSubButton>
                        {(user.role === 'Спонсор') && (
                          <SidebarMenuSubButton href="/sponsorship/management">Мои Кампании</SidebarMenuSubButton>
                        )}
                      </SidebarMenuSubItem>
                    </CollapsibleSidebarMenuItem>

                    <CollapsibleSidebarMenuItem icon={<BrainCircuit />} title="Инструменты AI">
                       <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/ai-analysis">Анализ контента</SidebarMenuSubButton>
                        <SidebarMenuSubButton href="/audio-generation">Генерация аудио</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </CollapsibleSidebarMenuItem>

                    <SidebarSeparator className="my-1" />
                    
                    {(user.role === 'Администратор' || user.role === 'Admin') && (
                      <>
                        <CollapsibleSidebarMenuItem icon={<Shield />} title="Администрирование">
                           <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="/administration">Дашборд</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/users">Пользователи</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/sports">Виды спорта</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/moderation-queue">Модерация</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/gamification">Геймификация</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/administrator">Профиль Админа</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/moderator">Профиль Модератора</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/judge">Профиль Судьи</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/coach">Профиль Тренера</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/manager">Профиль Менеджера</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/organizer">Профиль Организатора</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/sponsor">Профиль Спонсора</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/fan">Профиль Болельщика</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/administration/player">Профиль Игрока</SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </CollapsibleSidebarMenuItem>
                        <SidebarSeparator className="my-1" />
                      </>
                    )}

                    <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Поддержка">
                        <Link href="/support"><LifeBuoy />Поддержка</Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Настройки">
                        <Link href="/settings"><Settings />Настройки</Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                    <CollapsibleSidebarMenuItem icon={<FolderKanban />} title="Документы">
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="/documents/vision-and-principles">Видение и Принципы</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/documents/architecture">Архитектура (FSD)</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/documents/backend-roadmap">Бэкенд Roadmap</SidebarMenuSubButton>
                            <SidebarMenuSubButton href="/documents/backend-production">Готовность к продакшену</SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </CollapsibleSidebarMenuItem>
                    </SidebarMenuItem>

                     <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Демо темы">
                        <Link href="/theme-demo"><Palette />Демо темы</Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
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
        </SidebarProvider>
    );
}
