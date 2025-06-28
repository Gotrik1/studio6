import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Handshake, Users, DollarSign, FileText, Award } from "lucide-react";

const achievements = [
  { name: "Первый контракт", icon: FileText, description: "Подписать своего первого игрока в команду.", unlocked: true },
  { name: "Спонсорская сделка", icon: Handshake, description: "Заключить крупную спонсорскую сделку для своей команды.", unlocked: true },
  { name: "Команда мечты", icon: Users, description: "Собрать полный состав из 5 игроков.", unlocked: true },
  { name: "Золотая жила", icon: DollarSign, description: "Управлять командой с бюджетом более $50,000.", unlocked: false },
  { name: "Профессиональный менеджер", icon: Briefcase, description: "Управлять командой 3 сезона подряд.", unlocked: false },
  { name: "Менеджер года", icon: Award, description: "Быть избранным Менеджером года.", unlocked: false },
];

export default function ManagerProfilePage() {
  const user = {
    name: 'Джерри Магуайр',
    email: 'jerry.m@prodvor.com',
    role: 'Менеджер',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-accent">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="business manager" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary" className="bg-accent/80 text-accent-foreground">{user.role}</Badge>
              <Badge variant="secondary">Агент команды</Badge>
            </div>
          </div>
          <Button>Связаться</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Профессиональный менеджер и агент команд.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика управления</TabsTrigger>
          <TabsTrigger value="achievements">Достижения менеджера</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Управляемых игроков</CardDescription>
                <CardTitle className="font-headline text-4xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Привлечено спонсоров</CardDescription>
                <CardTitle className="font-headline text-4xl">5</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Стоимость команды</CardDescription>
                <CardTitle className="font-headline text-4xl">$250k</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Заключено контрактов</CardDescription>
                <CardTitle className="font-headline text-4xl">21</CardTitle>
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
