
import { getSession, type User } from "@/lib/session";
import { redirect } from "next/navigation";
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
  Star,
  Gavel,
  HeartPulse,
  Handshake,
  Calendar,
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
  Radio,
  Bot,
} from "lucide-react";
import { CollapsibleSidebarMenuItem } from "@/components/collapsible-sidebar-menu-item";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeCustomizer } from "@/components/theme-customizer";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect("/auth");
  }

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
                <Link href="/dashboard">
                  <Newspaper />
                  Лента
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Мой профиль">
                <Link href="/profile">
                  <UserIcon />
                  Мой профиль
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Команды">
                <Link href="/teams">
                  <Users />
                  Команды
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Матчи">
                <Link href="/matches">
                  <Swords />
                  Матчи
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Площадки">
                <Link href="/booking">
                  <MapPin />
                  Площадки
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Поиск">
                <Link href="/search">
                  <Search />
                  Поиск
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Турниры">
                <Link href="/tournaments">
                  <Trophy />
                  Турниры
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Лидерборды">
                <Link href="/leaderboards">
                  <BarChart3 />
                  Лидерборды
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Промо-акции">
                <Link href="/promotions">
                  <Megaphone />
                  Промо-акции
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Магазин">
                 <Link href="/store">
                    <Gem />
                    Магазин
                 </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Монетизация">
                <Link href="/monetization">
                  <Crown />
                  Монетизация
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Центр Судей">
                <Link href="/judge-center">
                  <Gavel />
                  Центр Судей
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Спонсоры">
                <Link href="/sponsors">
                  <Handshake />
                  Спонсоры
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Чаты">
                <Link href="/chats">
                  <MessageSquare />
                  Чаты
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Экономика PD">
                <Link href="/pd-economy">
                  <Coins />
                  Экономика PD
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="ИИ-Анализ">
                <Link href="/ai-analysis">
                  <BrainCircuit />
                  ИИ-Анализ
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Генерация речи">
                <Link href="/tts">
                  <AudioLines />
                  Генерация речи
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Генерация диалогов">
                <Link href="/dialogue-generation">
                  <Radio />
                  Генерация диалогов
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Поддержка">
                <Link href="/support">
                  <LifeBuoy />
                  Поддержка
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Настройки">
                <Link href="/settings">
                  <Settings />
                  Настройки
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <CollapsibleSidebarMenuItem icon={<FolderKanban />} title="Документы">
                  <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="/documents/architecture">Архитектура (FSD)</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="/documents/backend-roadmap">Бэкенд Roadmap</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="/documents/backend-production">Готовность к продакшену</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="/documents/vision-and-principles">Видение и Принципы</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
              </CollapsibleSidebarMenuItem>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Демо темы">
                <Link href="/theme-demo">
                  <Palette />
                  Демо темы
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {(user.role === 'Администратор' || user.role === 'Admin') && (
              <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Администрирование">
                    <Link href="/administration">
                      <Shield />
                      Администрирование
                    </Link>
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
