
'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import type { teams } from "@/shared/lib/mock-data/profiles";
import { Badge } from "@/shared/ui/badge";

type Team = (typeof teams)[0];

interface TeamsTabProps {
    teams: Team[];
    isCurrentUser: boolean;
    userName: string;
}

export function TeamsTab({ teams, isCurrentUser, userName }: TeamsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{isCurrentUser ? "Мои команды" : "Команды"}</CardTitle>
                <CardDescription>{isCurrentUser ? "Команды, в которых вы состоите." : `Команды, в которых состоит ${userName}`}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team) => (
                      <Link href={`/teams/${team.slug}`} key={team.name} className="block h-full">
                          <Card className="flex h-full flex-col items-center p-6 text-center transition-all hover:shadow-lg">
                            <Image 
                              src={team.logo} 
                              alt={`Логотип ${team.name}`} 
                              width={80} 
                              height={80} 
                              className="rounded-full border"
                              data-ai-hint={team.dataAiHint}
                            />
                            <CardTitle className="mt-4 font-headline">{team.name}</CardTitle>
                            <CardDescription>{team.role} в {team.game}</CardDescription>
                             <div className="mt-4 flex-1 flex items-end">
                                <Badge variant="secondary">Ранг: #{team.rank}</Badge>
                            </div>
                          </Card>
                      </Link>
                  ))}
              </div>
            </CardContent>
        </Card>
    );
}
