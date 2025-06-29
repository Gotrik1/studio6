'use client';

import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { BrainCircuit, FileText, BarChart3, Users, Camera } from "lucide-react";
import type { MatchDetails } from "@/entities/match/model/types";
import { OverviewTab } from "@/widgets/match-details-tabs/ui/overview-tab";
import { StatsTab } from "@/widgets/match-details-tabs/ui/stats-tab";
import { LineupsTab } from "@/widgets/match-details-tabs/ui/lineups-tab";
import { MediaTab } from "@/widgets/match-details-tabs/ui/media-tab";
import { AiAnalysisTab } from "@/widgets/match-details-tabs/ui/ai-analysis-tab";

interface MatchDetailsPageProps {
    match: MatchDetails;
}

export function MatchDetailsPage({ match }: MatchDetailsPageProps) {
    const getStatusVariant = (status: string) => {
        if (status === "Завершен") return "outline";
        return "default";
    };

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                 <div className="relative h-48 sm:h-64">
                    <Image src="https://placehold.co/1200x400.png" alt={`${match.tournament} banner`} fill className="object-cover" data-ai-hint="esports stadium lights" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-4 border-background">
                                    <AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} />
                                    <AvatarFallback>{match.team1.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h1 className="font-headline text-2xl sm:text-4xl font-bold text-white shadow-lg">{match.team1.name}</h1>
                            </div>
                            <div className="text-center px-4">
                                <p className="font-headline text-4xl sm:text-6xl font-bold text-white shadow-lg">{match.score}</p>
                                <Badge variant={getStatusVariant(match.status)}>{match.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="font-headline text-2xl sm:text-4xl font-bold text-white shadow-lg">{match.team2.name}</h1>
                                <Avatar className="h-16 w-16 border-4 border-background">
                                     <AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} />
                                     <AvatarFallback>{match.team2.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Tabs defaultValue="overview">
                 <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                    <TabsTrigger value="overview"><FileText className="mr-2 h-4 w-4"/>Обзор</TabsTrigger>
                    <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
                    <TabsTrigger value="lineups"><Users className="mr-2 h-4 w-4"/>Составы</TabsTrigger>
                    <TabsTrigger value="media"><Camera className="mr-2 h-4 w-4"/>Медиа</TabsTrigger>
                    <TabsTrigger value="ai-analysis"><BrainCircuit className="mr-2 h-4 w-4"/>AI-Анализ</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                    <OverviewTab match={match} />
                </TabsContent>
                <TabsContent value="stats" className="mt-4">
                    <StatsTab stats={match.teamStats} />
                </TabsContent>
                <TabsContent value="lineups" className="mt-4">
                    <LineupsTab match={match} />
                </TabsContent>
                <TabsContent value="media" className="mt-4">
                    <MediaTab media={match.media} />
                </TabsContent>
                <TabsContent value="ai-analysis" className="mt-4">
                    <AiAnalysisTab match={match} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
