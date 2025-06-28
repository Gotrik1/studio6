
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, SlidersHorizontal, Map } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";

const teams = [
  {
    name: "Кибер Орлы",
    slug: "cyber-eagles",
    motto: "Выше всех, быстрее всех, сильнее всех!",
    captain: "Alex 'CyberSlasher' Doe",
    members: 5,
    rank: 1,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "eagle logo"
  },
  {
    name: "Вихревые Гадюки",
    slug: "#",
    motto: "Один укус, и ты в лобби.",
    captain: "Jane 'Venom' Doe",
    members: 5,
    rank: 2,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "snake logo"
  },
  {
    name: "Квантовые Квазары",
    slug: "#",
    motto: "Ярче тысячи солнц.",
    captain: "Alex 'Nova' Ray",
    members: 5,
    rank: 3,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "galaxy logo"
  },
  {
    name: "Багровые Крестоносцы",
    slug: "#",
    motto: "За честь и славу!",
    captain: "Sam 'The-Rock' Stone",
    members: 4,
    rank: 4,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "knight logo"
  },
    {
    name: "Стальные Титаны",
    slug: "#",
    motto: "Несокрушимая воля, несгибаемая сталь.",
    captain: "Max 'Titan' Iron",
    members: 5,
    rank: 5,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "robot titan"
  },
  {
    name: "Призрачные Волки",
    slug: "#",
    motto: "Мы тень, что приносит победу.",
    captain: "Yuri 'Ghost' Volkov",
    members: 5,
    rank: 6,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "wolf logo"
  },
];

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Каталог команд</h1>
        <p className="text-muted-foreground">Найди команду своей мечты или создай новую. На платформе уже {teams.length} команд!</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Поиск по названию, городу или виду спорта..." className="w-full pl-10" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="w-full md:w-auto">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Фильтры
                </Button>
                 <Button variant="outline" className="w-full md:w-auto">
                  <Map className="mr-2 h-4 w-4" />
                  Показать на карте
                </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
            <Separator className="mb-6" />
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed bg-muted/50 p-6 text-center transition-colors hover:border-primary">
                    <CardTitle className="font-headline">Создай свою команду</CardTitle>
                    <CardDescription>Собери друзей, выбери название и начни свой путь к славе.</CardDescription>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать команду
                    </Button>
                </Card>
                {teams.map((team) => (
                  <Link href={team.slug === "#" ? "#" : `/teams/${team.slug}`} key={team.name} className="flex h-full">
                    <Card className="flex w-full flex-col overflow-hidden transition-all hover:shadow-lg">
                      <CardHeader className="flex flex-row items-start gap-4 bg-muted/30 p-4">
                        <Image 
                          src={team.logo} 
                          alt={`Логотип ${team.name}`} 
                          width={64} 
                          height={64} 
                          className="rounded-full border-2 border-background"
                          data-ai-hint={team.dataAiHint}
                        />
                        <div className="flex-1">
                            <CardTitle className="font-headline text-lg">{team.name}</CardTitle>
                            <CardDescription className="line-clamp-2 text-xs italic">"{team.motto}"</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-4">
                        <div className="text-xs text-muted-foreground">Капитан: <span className="font-medium text-foreground">{team.captain}</span></div>
                      </CardContent>
                      <CardFooter className="flex justify-between bg-muted/20 p-4 text-sm">
                        <Badge variant="secondary">Ранг #{team.rank}</Badge>
                        <div className="text-muted-foreground">{team.members}/5 Участников</div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
