import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, ClipboardCheck, Trophy, CalendarDays, Shield, Scale } from "lucide-react";

const achievements = [
  { name: "Первое судейство", icon: Gavel, description: "Отсудить свой первый официальный матч.", unlocked: true },
  { name: "Турнирный судья", icon: Trophy, description: "Работать судьей на крупном турнире.", unlocked: true },
  { name: "Железный судья", icon: CalendarDays, description: "Отсудить 50 матчей за один сезон.", unlocked: true },
  { name: "Награда за честную игру", icon: Shield, description: "Получить рейтинг справедливости 99%+ от игроков.", unlocked: false },
  { name: "Разрешитель споров", icon: Scale, description: "Успешно разрешить 20 споров по счету.", unlocked: false },
  { name: "Сертифицированный профи", icon: ClipboardCheck, description: "Пройти профессиональную сертификацию судей.", unlocked: true },
];

export default function JudgeProfilePage() {
  const user = {
    name: 'Судья Джуди',
    email: 'judy.j@prodvor.com',
    role: 'Судья',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-secondary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="judge portrait" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary">{user.role}</Badge>
              <Badge variant="outline">Сертифицированный судья</Badge>
            </div>
          </div>
          <Button>Просмотр расписания</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Сертифицированный судья для турниров по CS:GO 2 и Valorant.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика судейства</TabsTrigger>
          <TabsTrigger value="achievements">Достижения судьи</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Судейство матчей</CardDescription>
                <CardTitle className="font-headline text-4xl">217</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Обслужено турниров</CardDescription>
                <CardTitle className="font-headline text-4xl">15</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Решено споров</CardDescription>
                <CardTitle className="font-headline text-4xl">8</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Рейтинг от игроков</CardDescription>
                <CardTitle className="font-headline text-4xl">4.9/5.0</CardTitle>
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
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-secondary-foreground bg-secondary' : 'border-dashed'}`}>
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
