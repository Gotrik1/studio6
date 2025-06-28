
'use client';

import type { User } from "@/lib/types";
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
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/icons";
import {
  Newspaper,
  User as UserIcon,
  Users,
  MapPin,
  Search,
  Dumbbell,
  Trophy,
  BarChart3,
  Award,
  Gavel,
  HeartPulse,
  Handshake,
  MessageSquare,
  Crown,
  Settings,
  FolderKanban,
  Shield,
  BrainCircuit,
  Swords,
  LifeBuoy,
  Megaphone,
  Coins,
  Gem,
  Palette,
  AudioLines,
  Briefcase,
  UserPlus,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import { CollapsibleSidebarMenuItem } from "@/components/collapsible-sidebar-menu-item";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { NotificationsPopover } from "@/components/notifications-popover";

interface AppLayoutClientProps {
    user: User;
    children: React.ReactNode;
}

export default function AppLayoutClient({ user, children }: AppLayoutClientProps) {
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
                      <SidebarMenuButton asChild tooltip="Поиск">
                          <Link href="/search"><Search />Поиск</Link>
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

                    <CollapsibleSidebarMenuItem icon={<TrendingUp />} title="Развитие">
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

                    {(user.role === 'Администратор' || user.role === 'Admin') && (
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Администрирование">
                            <Link href="/administration"><Shield />Администрирование</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    )}
                </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
                <SidebarTrigger className="flex md:hidden" />
                <div className="flex-1">
                    {/* Can add breadcrumbs or page title here */}
                </div>
                <NotificationsPopover />
                <ThemeCustomizer />
                <ThemeToggle />
                <UserNav user={user} />
                </header>
                <div className="flex-1 overflow-auto p-4 pb-20 sm:p-6 md:pb-6">{children}</div>
                <BottomNav />
            </SidebarInset>
        </SidebarProvider>
    );
}
