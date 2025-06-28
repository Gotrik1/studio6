import { getSession, type User } from "@/lib/session";
import { redirect } from "next/navigation";
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
} from "lucide-react";
import { CollapsibleSidebarMenuItem } from "@/components/collapsible-sidebar-menu-item";

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
              <SidebarMenuButton href="/dashboard" tooltip="Лента">
                <Newspaper />
                Лента
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/profile" tooltip="Мой профиль">
                <UserIcon />
                Мой профиль
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/teams" tooltip="Команды">
                <Users />
                Команды
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Площадки">
                <MapPin />
                Площадки
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Поиск">
                <Search />
                Поиск
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Тренировки">
                <Dumbbell />
                Тренировки
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/tournaments" tooltip="Турниры">
                <Trophy />
                Турниры
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Лидерборды">
                <BarChart3 />
                Лидерборды
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Каталог Достижений">
                <Award />
                Каталог Достижений
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Фан-зона">
                <Star />
                Фан-зона
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Центр Судей">
                <Gavel />
                Центр Судей
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Мед. Обеспечение">
                <HeartPulse />
                Мед. Обеспечение
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Спонсоры">
                <Handshake />
                Спонсоры
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="События">
                <Calendar />
                События
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Чаты">
                <MessageSquare />
                Чаты
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/monetization" tooltip="PRO-Доступ">
                <Crown />
                PRO-Доступ
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/ai-analysis" tooltip="ИИ-Анализ">
                <BrainCircuit />
                ИИ-Анализ
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Настройки">
                <Settings />
                Настройки
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <CollapsibleSidebarMenuItem icon={<FolderKanban />} title="Документы">
                  <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="/documents/architecture">Архитектура</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="/documents/backend-roadmap">Бэкенд Roadmap</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="/documents/backend-production">Готовность к продакшену</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
              </CollapsibleSidebarMenuItem>
            </SidebarMenuItem>
            {user.role === 'Администратор' && (
              <SidebarMenuItem>
                  <SidebarMenuButton href="/administration" tooltip="Администрирование">
                    <Shield />
                    Администрирование
                  </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Can add breadcrumbs or page title here */}
          </div>
          <UserNav user={user} />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
