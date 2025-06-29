'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { generatePlatformNews, type GeneratePlatformNewsOutput } from "@/shared/api/genkit/flows/generate-platform-news-flow";
import { useEffect, useState } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { PollCard } from "@/widgets/poll-card";
import { mainPoll, teamOfTheWeek } from "@/shared/lib/mock-data/dashboard";
import Image from "next/image";

export function DashboardPage() {
    const [news, setNews] = useState<GeneratePlatformNewsOutput['news']>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadNews() {
            setIsLoading(true);
            try {
                const { news: fetchedNews } = await generatePlatformNews();
                setNews(fetchedNews);
            } catch (error) {
                console.error("Failed to load news:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadNews();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Лента новостей</CardTitle>
                        <CardDescription>Последние события на платформе, сгенерированные AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            news.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                     <Avatar>
                                        <AvatarFallback>{item.category.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <Link href={item.href} className="font-semibold hover:underline">
                                            {item.title}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">{item.summary}</p>
                                    </div>
                                    <Badge variant="outline">{item.category}</Badge>
                                </div>
                            ))
                        )}
                         {!isLoading && (
                            <Button variant="ghost" onClick={() => setIsLoading(true)} disabled={isLoading}>
                                <Loader2 className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
                                Обновить ленту
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Команда недели</CardTitle>
                    </CardHeader>
                     <CardContent className="flex flex-col items-center text-center">
                         <Image src={teamOfTheWeek.logo} alt={teamOfTheWeek.name} width={96} height={96} className="rounded-full border-4 border-primary" data-ai-hint={teamOfTheWeek.logoHint}/>
                        <h3 className="mt-4 font-headline text-2xl font-bold">{teamOfTheWeek.name}</h3>
                        <p className="text-sm text-muted-foreground">{teamOfTheWeek.reason}</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" asChild>
                            <Link href={`/teams/${teamOfTheWeek.slug}`}>Профиль команды <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
                <PollCard poll={mainPoll} />
            </div>
        </div>
    );
}
