import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Calendar } from "lucide-react";
import Image from "next/image";

const tournaments = [
  {
    name: "Summer Kickoff 2024",
    game: "Valorant",
    prize: "$5,000",
    participants: 32,
    date: "August 15, 2024",
    status: "Open",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "esports gaming"
  },
  {
    name: "Cybernetic Clash",
    game: "CS:GO 2",
    prize: "$10,000",
    participants: 64,
    date: "September 1, 2024",
    status: "Open",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "futuristic soldiers"
  },
  {
    name: "Apex Predator Series",
    game: "Apex Legends",
    prize: "$2,500",
    participants: 20,
    date: "August 20, 2024",
    status: "In Progress",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "sci-fi battle"
  },
  {
    name: "The King's Gauntlet",
    game: "League of Legends",
    prize: "$7,500",
    participants: 16,
    date: "July 30, 2024",
    status: "Finished",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "fantasy battle"
  },
];

export default function TournamentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Tournaments</h1>
          <p className="text-muted-foreground">Compete for glory and prizes.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Tournament
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tournaments.map((tournament) => (
          <Card key={tournament.name} className="overflow-hidden">
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
            <CardContent className="p-6">
              <Badge variant="secondary" className="mb-2">{tournament.game}</Badge>
              <CardTitle className="font-headline">{tournament.name}</CardTitle>
              <CardDescription className="font-bold text-accent">{tournament.prize} Prize Pool</CardDescription>
              <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1.5 h-4 w-4" />
                  <span>{tournament.participants} Teams</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  <span>{tournament.date}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-muted/50 p-6">
               <Badge variant={
                  tournament.status === 'Open' ? 'default' : 
                  tournament.status === 'In Progress' ? 'destructive' : 'outline'
                }>
                  {tournament.status}
                </Badge>
              <Button disabled={tournament.status !== 'Open'}>Register Team</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
