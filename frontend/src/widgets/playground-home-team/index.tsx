
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Crown, Sword } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip';
import type { KingTeam } from '@/entities/playground/model/types';

interface KingOfTheCourtWidgetProps {
    homeTeamData: KingTeam | null;
    isLoading: boolean;
}

const getWinsText = (count: number): string => {
    const titles = ['победа', 'победы', 'побед'];
    const cases = [2, 0, 1, 1, 1, 2];
    const num = Math.abs(count);

    if (num % 100 > 4 && num % 100 < 20) {
        return titles[2];
    }
    if (num % 10 > 4) {
        return titles[2];
    }
    return titles[cases[num % 10]];
};

export function KingOfTheCourtWidget({ homeTeamData, isLoading }: KingOfTheCourtWidgetProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 text-center">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        )
    }

    if (!homeTeamData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Crown /> Король площадки</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center p-4">
                        На этой площадке еще не было матчей. Станьте первыми, кто завоюет ее!
                    </p>
                </CardContent>
            </Card>
        );
    }
    
    const winsText = `${homeTeamData.wins} ${getWinsText(homeTeamData.wins)} на этой площадке`;

    return (
        <Card className="bg-amber-500/5 border-amber-500/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Crown className="text-amber-500" /> Король площадки</CardTitle>
                <CardDescription>Команда с наибольшим количеством побед на этом месте.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 text-center">
                 <Link href={`/teams/${homeTeamData.slug}`} className="block">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="h-20 w-20 border-4 border-amber-400">
                                    <AvatarImage src={homeTeamData.logo || ''} alt={homeTeamData.name} data-ai-hint={homeTeamData.dataAiHint || ''} />
                                    <AvatarFallback className="text-2xl">{homeTeamData.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Перейти в профиль команды</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                 </Link>
                 <div>
                    <Link href={`/teams/${homeTeamData.slug}`} className="block">
                        <p className="text-xl font-bold hover:underline">{homeTeamData.name}</p>
                    </Link>
                    <p className="text-muted-foreground">{winsText}</p>
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full">
                    <Sword className="mr-2 h-4 w-4" /> Бросить вызов Королю
                </Button>
            </CardFooter>
        </Card>
    );
}
