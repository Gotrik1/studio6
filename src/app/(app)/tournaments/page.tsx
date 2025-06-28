import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const tournaments = [
  {
    name: "Summer Kickoff 2024",
    slug: "/tournaments/summer-kickoff",
    game: "Valorant",
    prize: "$5,000",
    participants: 32,
    date: "15 августа 2024",
    status: "Регистрация",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "esports gaming"
  },
  {
    name: "Cybernetic Clash",
    slug: "#",
    game: "CS:GO 2",
    prize: "$10,000",
    participants: 64,
    date: "1 сентября 2024",
    status: "Регистрация",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "futuristic soldiers"
  },
  {
    name: "Apex Predator Series",
    slug: "#",
    game: "Apex Legends",
    prize: "$2,500",
    participants: 20,
    date: "20 августа 2024",
    status: "Идет",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "sci-fi battle"
  },
  {
    name: "The King's Gauntlet",
    slug: "#",
    game: "League of Legends",
    prize: "$7,500",
    participants: 16,
    date: "30 июля 2024",
    status: "Завершен",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "fantasy battle"
  },
];

export default function TournamentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Турниры</h1>
          <p className="text-muted-foreground">Соревнуйтесь за славу и призы.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Создать турнир
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tournaments.map((tournament) => (
          <Link href={tournament.slug} key={tournament.name} className="flex h-full">
            <Card className="flex w-full flex-col overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="p-0">
                <Image 
                  src={tournament.image} 
                  alt={tournament.name} 
                  width={600} 
                  height={400} 
                  className="aspect-video object-cover"
                  data-ai-hint={tournament.dataAiHint}
                />
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <Badge variant="secondary" className="mb-2">{tournament.game}</Badge>
                <CardTitle className="font-headline">{tournament.name}</CardTitle>
                <CardDescription className="font-bold text-accent">{tournament.prize} Призовой фонд</CardDescription>
                <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="mr-1.5 h-4 w-4" />
                    <span>{tournament.participants} Команд</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    <span>{tournament.date}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-muted/50 p-6">
                 <Badge variant={
                    tournament.status === 'Регистрация' ? 'default' : 
                    tournament.status === 'Идет' ? 'destructive' : 'outline'
                  }>
                    {tournament.status}
                  </Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
