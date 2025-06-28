import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Shield, Gavel, User, Award, Briefcase, Star, Handshake, Trophy, Scale, Users2, Gamepad2, Activity } from "lucide-react";

const roles = [
  { name: "Управление пользователями", href: "/administration/users", icon: Users2, description: "Просмотр и поиск всех пользователей." },
  { name: "Администратор", href: "/administration/administrator", icon: Shield, description: "Полный доступ к системе." },
  { name: "Модератор", href: "/administration/moderator", icon: Gavel, description: "Управление контентом и жалобами." },
  { name: "Игрок (Капитан)", href: "/administration/player", icon: User, description: "Профиль капитана команды." },
  { name: "Тренер", href: "/administration/coach", icon: Award, description: "Профиль тренера команды." },
  { name: "Судья", href: "/administration/judge", icon: Scale, description: "Профиль сертифицированного судьи." },
  { name: "Менеджер", href: "/administration/manager", icon: Briefcase, description: "Профиль менеджера команды." },
  { name: "Болельщик", href: "/administration/fan", icon: Star, description: "Профиль активного болельщика." },
  { name: "Спонсор", href: "/administration/sponsor", icon: Handshake, description: "Профиль спонсора." },
  { name: "Организатор", href: "/administration/organizer", icon: Trophy, description: "Профиль организатора турниров." },
  { name: "Геймификация", href: "/administration/gamification", icon: Gamepad2, description: "Управление очками, ачивками и экономикой." },
  { name: "Виды спорта", href: "/administration/sports", icon: Activity, description: "Управление доступными дисциплинами." },
];

export default function AdministrationHubPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Панель администрирования</h1>
        <p className="text-muted-foreground">
          Просмотр макетов профилей и управление пользователями платформы.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Link href={role.href} key={role.name} className="block h-full">
            <Card className="flex h-full flex-col transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <role.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
