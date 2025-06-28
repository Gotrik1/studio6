import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Shield, MessageSquareX, UserX, UserCheck, Eye } from "lucide-react";

const achievements = [
  { name: "Первое решение", icon: Gavel, description: "Рассмотреть свою первую жалобу на контент.", unlocked: true },
  { name: "Миротворец", icon: Shield, description: "Успешно разрешить 50 споров.", unlocked: true },
  { name: "Активный наблюдатель", icon: Eye, description: "Просмотреть 1000 единиц контента.", unlocked: true },
  { name: "Чистая работа", icon: MessageSquareX, description: "Обработать 100 жалоб за один день.", unlocked: false },
  { name: "Повышение пользователя", icon: UserCheck, description: "Повысить пользователя до доверенной роли.", unlocked: true },
  { name: "Вечный бан", icon: UserX, description: "Выдать постоянный бан за серьезное нарушение.", unlocked: false },
];

export default function ModeratorProfilePage() {
  const user = {
    name: 'Модератор Макс',
    email: 'max.mod@prodvor.com',
    role: 'Модератор',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-accent">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="moderator avatar" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary" className="bg-accent/80 text-accent-foreground">{user.role}</Badge>
              <Badge variant="secondary">Хранитель контента</Badge>
            </div>
          </div>
          <Button>Очередь модерации</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Модератор, ответственный за соблюдение правил сообщества.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика модерации</TabsTrigger>
          <TabsTrigger value="achievements">Достижения модератора</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Решено жалоб (24ч)</CardDescription>
                <CardTitle className="font-headline text-4xl">38</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Предупреждено</CardDescription>
                <CardTitle className="font-headline text-4xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Забанено (7д)</CardDescription>
                <CardTitle className="font-headline text-4xl">4</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Точность</CardDescription>
                <CardTitle className="font-headline text-4xl">98.5%</CardTitle>
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
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-accent bg-accent/20 text-accent' : 'border-dashed'}`}>
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
