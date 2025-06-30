
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PollCard } from "@/widgets/poll-card";
import { mainPoll, teamOfTheWeek } from "@/shared/lib/mock-data/dashboard";
import Image from "next/image";
import { Feed } from '@/widgets/feed';
import { StatusUpdateForm } from '@/widgets/status-update-form';
import { AiNewsDigest } from "@/widgets/ai-news-digest";

export function DashboardPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="opacity-0 animate-fade-in-up">
                    <AiNewsDigest />
                </div>
                <div className="opacity-0 animate-fade-in-up animation-delay-300">
                    <StatusUpdateForm />
                </div>
                <div className="opacity-0 animate-fade-in-up animation-delay-600">
                    <Feed />
                </div>
            </div>
            <aside className="space-y-6 lg:sticky lg:top-20 self-start opacity-0 animate-fade-in-up animation-delay-300">
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
            </aside>
        </div>
    );
}
