import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, TrendingUp, Trophy, Users, Star, Award } from "lucide-react";

const achievements = [
  { name: "Первая победа", icon: Trophy, description: "Привести команду к первой победе на турнире.", unlocked: true },
  { name: "Поиск талантов", icon: Star, description: "Найти и обучить игрока высшего ранга.", unlocked: true },
  { name: "Полный состав", icon: Users, description: "Управлять командой с полным и активным составом в течение сезона.", unlocked: true },
  { name: "Мастер-стратег", icon: ClipboardList, description: "Разработать 10 уникальных выигрышных стратегий.", unlocked: false },
  { name: "Восхождение", icon: TrendingUp, description: "Улучшить ранг команды на 50 позиций.", unlocked: false },
  { name: "Тренер года", icon: Award, description: "Быть избранным Тренером года по мнению сообщества.", unlocked: false },
];

export default function CoachProfilePage() {
  const user = {
    name: 'Тренер Картер',
    email: 'coach.carter@prodvor.com',
    role: 'Тренер',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="sports coach" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge>{user.role}</Badge>
              <Badge variant="secondary">Сертифицированный ментор</Badge>
            </div>
          </div>
          <Button>Просмотр команды</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Опытный тренер, специализирующийся на командных стратегиях в Valorant.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика тренера</TabsTrigger>
          <TabsTrigger value="achievements">Достижения тренера</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Процент побед команды</CardDescription>
                <CardTitle className="font-headline text-4xl">68%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Игроков обучено</CardDescription>
                <CardTitle className="font-headline text-4xl">25</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Выиграно турниров</CardDescription>
                <CardTitle className="font-headline text-4xl">3</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Средний рост игрока</CardDescription>
                <CardTitle className="font-headline text-4xl">+250 ELO</CardTitle>
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
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-primary bg-primary/20 text-primary' : 'border-dashed'}`}>
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
