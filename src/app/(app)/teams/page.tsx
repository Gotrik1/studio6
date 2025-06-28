import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

const teams = [
  {
    name: "Кибер Орлы",
    captain: "John 'EagleEye' Smith",
    members: 5,
    rank: 1,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "eagle logo"
  },
  {
    name: "Вихревые Гадюки",
    captain: "Jane 'Venom' Doe",
    members: 5,
    rank: 2,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "snake logo"
  },
  {
    name: "Квантовые Квазары",
    captain: "Alex 'Nova' Ray",
    members: 5,
    rank: 3,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "galaxy logo"
  },
  {
    name: "Багровые Крестоносцы",
    captain: "Sam 'The-Rock' Stone",
    members: 4,
    rank: 4,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "knight logo"
  },
];

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Команды</h1>
          <p className="text-muted-foreground">Просматривайте, присоединяйтесь или создавайте свою собственную команду.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Поиск команд..." className="pl-8" />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать команду
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => (
          <Link href="#" key={team.name} className="flex h-full">
            <Card className="flex w-full flex-col transition-all hover:shadow-md">
              <CardHeader className="items-center">
                <Image 
                  src={team.logo} 
                  alt={`Логотип ${team.name}`} 
                  width={80} 
                  height={80} 
                  className="rounded-full border"
                  data-ai-hint={team.dataAiHint}
                />
              </CardHeader>
              <CardContent className="flex-1 text-center">
                <CardTitle className="font-headline">{team.name}</CardTitle>
                <CardDescription>Капитан: {team.captain}</CardDescription>
                <Badge variant="secondary" className="mt-2">Ранг #{team.rank}</Badge>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">{team.members}/5 Участников</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
