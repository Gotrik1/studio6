import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Handshake, Megaphone, DollarSign, Target, Users, Award } from "lucide-react";

const achievements = [
  { name: "Первое партнерство", icon: Handshake, description: "Спонсировать свою первую команду или турнир.", unlocked: true },
  { name: "Мастер кампаний", icon: Megaphone, description: "Провести успешную рекламную кампанию с более чем 1 млн показов.", unlocked: false },
  { name: "Инвестор сообщества", icon: Users, description: "Спонсировать 5 различных команд сообщества.", unlocked: true },
  { name: "Крупный игрок", icon: DollarSign, description: "Внести более $20,000 в призовые фонды.", unlocked: false },
  { name: "Строитель бренда", icon: Target, description: "Достичь 20% увеличения узнаваемости бренда.", unlocked: false },
  { name: "Спонсор года", icon: Award, description: "Быть избранным Спонсором года по мнению сообщества.", unlocked: false },
];

export default function SponsorProfilePage() {
  const user = {
    name: 'Sponsor Corp',
    email: 'contact@sponsorcorp.com',
    role: 'Спонсор',
    avatar: 'https://placehold.co/100x100.png',
  };

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-secondary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="corporate logo" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary">{user.role}</Badge>
              <Badge variant="outline">Официальный партнер</Badge>
            </div>
          </div>
          <Button>Просмотр кампаний</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Ведущий спонсор киберспортивных и игровых инициатив.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">ROI спонсорства</TabsTrigger>
          <TabsTrigger value="achievements">Вехи спонсора</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Проведено кампаний</CardDescription>
                <CardTitle className="font-headline text-4xl">18</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Охваченная аудитория</CardDescription>
                <CardTitle className="font-headline text-4xl">2.5M</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Спонсировано команд</CardDescription>
                <CardTitle className="font-headline text-4xl">7</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Общие инвестиции</CardDescription>
                <CardTitle className="font-headline text-4xl">$75k</CardTitle>
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
