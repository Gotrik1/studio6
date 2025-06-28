import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSession } from "@/lib/session";
import { Award, Users, Trophy, Target, Swords, Medal } from "lucide-react";
import { redirect } from "next/navigation";

const achievements = [
  { name: "Первая победа", icon: Award, description: "Выиграйте свой первый матч.", unlocked: true },
  { name: "Командный игрок", icon: Users, description: "Сыграйте 10 матчей в команде.", unlocked: true },
  { name: "Чемпион турнира", icon: Trophy, description: "Выиграйте турнир.", unlocked: false },
  { name: "Меткий стрелок", icon: Target, description: "Сделайте 50 выстрелов в голову.", unlocked: true },
  { name: "Гладиатор", icon: Swords, description: "Выиграйте 50 дуэлей 1 на 1.", unlocked: false },
  { name: "Ветеран", icon: Medal, description: "Сыграйте 100 матчей.", unlocked: false },
];

export default async function ProfilePage() {
  const user = await getSession();
  if (!user) redirect('/auth');

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge>{user.role}</Badge>
              <Badge variant="secondary">Уровень 27</Badge>
              <Badge variant="outline">PRO Пользователь</Badge>
            </div>
          </div>
          <Button>Редактировать профиль</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Прогресс до Уровня 28</span>
              <span>2,300 / 5,000 XP</span>
            </div>
            <Progress value={46} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика</TabsTrigger>
          <TabsTrigger value="achievements">Достижения</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Победы</CardDescription>
                <CardTitle className="font-headline text-4xl">152</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>K/D</CardDescription>
                <CardTitle className="font-headline text-4xl">1.78</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Сыграно турниров</CardDescription>
                <CardTitle className="font-headline text-4xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Лучший ранг</CardDescription>
                <CardTitle className="font-headline text-4xl">#23</CardTitle>
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
