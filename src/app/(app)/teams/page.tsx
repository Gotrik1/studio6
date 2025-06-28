import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
import Image from 'next/image';

const teams = [
  {
    name: "Cyber Eagles",
    captain: "John 'EagleEye' Smith",
    members: 5,
    rank: 1,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "eagle logo"
  },
  {
    name: "Vortex Vipers",
    captain: "Jane 'Venom' Doe",
    members: 5,
    rank: 2,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "snake logo"
  },
  {
    name: "Quantum Quasars",
    captain: "Alex 'Nova' Ray",
    members: 5,
    rank: 3,
    logo: "https://placehold.co/128x128.png",
    dataAiHint: "galaxy logo"
  },
  {
    name: "Crimson Crusaders",
    captain: "Sam 'The-Rock' Stone",
    members: 5,
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
          <h1 className="font-headline text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Browse, join, or create your own team.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search teams..." className="pl-8" />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => (
          <Card key={team.name} className="flex flex-col">
            <CardHeader className="items-center">
              <Image 
                src={team.logo} 
                alt={`${team.name} logo`} 
                width={80} 
                height={80} 
                className="rounded-full border"
                data-ai-hint={team.dataAiHint}
              />
            </CardHeader>
            <CardContent className="flex-1 text-center">
              <CardTitle className="font-headline">{team.name}</CardTitle>
              <CardDescription>Captain: {team.captain}</CardDescription>
              <Badge variant="secondary" className="mt-2">Rank #{team.rank}</Badge>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">{team.members}/5 Members</p>
              <Button variant="outline" size="sm">View</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
