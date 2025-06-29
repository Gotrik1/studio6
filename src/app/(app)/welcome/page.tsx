'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/session-client';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, Gamepad2, Lightbulb, Trophy, PartyPopper, Coins, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getOnboardingSuggestions, type OnboardingOutput } from '@/ai/flows/onboarding-assistant-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const iconMap = {
    User, Users, Gamepad2, Trophy, PlusCircle
};

function OnboardingSkeleton() {
    return (
        <Card className="w-full max-w-3xl">
            <CardHeader className="text-center">
                 <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                 <Skeleton className="h-8 w-3/4 mx-auto" />
                 <Skeleton className="h-6 w-1/2 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-3/4 mx-auto mb-6" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4 pt-6">
                 <Skeleton className="h-12 w-48" />
            </CardFooter>
        </Card>
    )
}

export default function WelcomePage() {
    const { user, loading: userLoading } = useSession();
    const [onboardingData, setOnboardingData] = useState<OnboardingOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const fetchOnboardingData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await getOnboardingSuggestions({
                        userName: user.name,
                        userRole: user.role,
                    });
                    setOnboardingData(data);
                } catch (err) {
                    console.error("Failed to fetch onboarding suggestions:", err);
                    setError("Не удалось загрузить персональные рекомендации. Пожалуйста, попробуйте обновить страницу.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOnboardingData();
        }
    }, [user]);

    if (userLoading) {
        return (
            <div className="flex min-h-full items-center justify-center p-4">
                <OnboardingSkeleton />
            </div>
        );
    }
    
    if (!user) {
        redirect("/auth");
    }

    if (isLoading) {
         return (
            <div className="flex min-h-full items-center justify-center p-4">
                <OnboardingSkeleton />
            </div>
        );
    }

    if (error) {
        return (
             <div className="flex min-h-full items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
             </div>
        )
    }

    if (!onboardingData) {
        return (
             <div className="flex min-h-full items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin" />
             </div>
        );
    }

    return (
        <div className="flex min-h-full items-center justify-center p-4">
            <Card className="w-full max-w-3xl animate-in fade-in-50">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <PartyPopper className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl">{onboardingData.greeting}</CardTitle>
                    <CardDescription className="text-lg">{onboardingData.mainSuggestion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="mb-4 text-center text-xl font-semibold">Ваши первые шаги</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {onboardingData.suggestions.map((quest) => {
                                const Icon = iconMap[quest.icon as keyof typeof iconMap] || Lightbulb;
                                return (
                                <Link href={quest.href} key={quest.title} className="block h-full">
                                    <div className="group relative flex h-full flex-col items-center rounded-lg border p-6 text-center transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md">
                                        {quest.reward && (
                                            <Badge variant="secondary" className="absolute -top-2 right-2 flex items-center gap-1 border-primary/50 bg-primary/10 text-primary">
                                                <Coins className="h-3 w-3" /> {quest.reward}
                                            </Badge>
                                        )}
                                        <Icon className="mb-3 h-10 w-10 text-muted-foreground transition-colors group-hover:text-accent-foreground" />
                                        <p className="font-semibold">{quest.title}</p>
                                        <p className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-accent-foreground">{quest.description}</p>
                                    </div>
                                </Link>
                            )})}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 pt-6">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/dashboard">К ленте новостей!</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
