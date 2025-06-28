import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Server, BarChart3, Users, Gavel, ArrowUpCircle } from "lucide-react";

const achievements = [
  { name: "Первое обновление системы", icon: ArrowUpCircle, description: "Успешно развернуть обновление системы.", unlocked: true },
  { name: "Хранитель сообщества", icon: Shield, description: "Рассмотреть 100 жалоб пользователей.", unlocked: true },
  { name: "Рост платформы", icon: Users, description: "Достичь 1000 активных пользователей.", unlocked: true },
  { name: "Первый банхаммер", icon: Gavel, description: "Принять первое модераторское решение.", unlocked: true },
  { name: "Стабильность сервера", icon: Server, description: "Поддерживать 99.9% времени безотказной работы в течение месяца.", unlocked: false },
  { name: "Поставщик фич", icon: BarChart3, description: "Проконтролировать запуск 5 крупных функций.", unlocked: false },
];

export default function AdministratorProfilePage() {
  const user = {
    name: 'Admin User',
    email: 'admin.user@prodvor.com',
    role: 'Администратор',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-destructive">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="administrator avatar" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="destructive">{user.role}</Badge>
              <Badge variant="secondary">Системный оператор</Badge>
            </div>
          </div>
          <Button>Панель администратора</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Аккаунт администратора с полными правами доступа к системе.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Метрики платформы</TabsTrigger>
          <TabsTrigger value="achievements">Достижения администратора</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Активные пользователи</CardDescription>
                <CardTitle className="font-headline text-4xl">1,257</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Открытые жалобы</CardDescription>
                <CardTitle className="font-headline text-4xl">14</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Время работы сервера</CardDescription>
                <CardTitle className="font-headline text-4xl">99.98%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Доход (месяц)</CardDescription>
                <CardTitle className="font-headline text-4xl">$5,230</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="achievements">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {achievements.map((ach) => (
                  <div key={ach.name} className={`flex flex-col items-center text-center ${ach.unlocked ? '' : 'opacity-40'}`}>
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-destructive bg-destructive/20 text-destructive' : 'border-dashed'}`}>
                      <ach.icon className="h-8 w-8" />
                    </div>
                    <p className="mt-2 font-semibold">{ach.name}</p>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
