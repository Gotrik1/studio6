
'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import type { Team } from "@/entities/team/model/types";
import { Badge } from "@/shared/ui/badge";

interface FavoriteTeamsTabProps {
    teams: Team[];
    userName: string;
}

export function FavoriteTeamsTab({ teams, userName }: FavoriteTeamsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Любимые команды</CardTitle>
                <CardDescription>Команды, за которыми следит {userName}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team) => (
                      <Link href={`/teams/${team.slug}`} key={team.name} className="block h-full">
                          <Card className="flex h-full flex-col items-center p-6 text-center transition-all hover:shadow-lg hover:border-primary">
                            <Image 
                              src={team.logo} 
                              alt={`Логотип ${team.name}`} 
                              width={80} 
                              height={80} 
                              className="rounded-full border"
                              data-ai-hint={team.dataAiHint}
                            />
                            <CardTitle className="mt-4 font-headline">{team.name}</CardTitle>
                            <CardDescription>{team.game}</CardDescription>
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
