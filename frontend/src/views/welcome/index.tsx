
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useSession } from '@/shared/lib/session/client';
import { getOnboardingSuggestions, type OnboardingOutput } from '@/shared/api/genkit/flows/onboarding-assistant-flow';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: { [key: string]: LucideIcon } = LucideIcons as any;

const OnboardingSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
        </div>
    </div>
);

export function WelcomePage() {
    const { user, loading: userLoading } = useSession();
    const [suggestions, setSuggestions] = useState<OnboardingOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getOnboardingSuggestions({ userName: user.name, userRole: user.role })
                .then((data) => setSuggestions(data))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        } else if (!userLoading) {
            setIsLoading(false);
        }
    }, [user, userLoading]);
    
    if (userLoading || isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                <Card className="w-full max-w-2xl p-8">
                    <OnboardingSkeleton />
                </Card>
            </div>
        );
    }
    
    if (!suggestions) {
         return (
             <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center text-center">
                 <p>Не удалось загрузить рекомендации. <Button variant="link" onClick={() => window.location.reload()}>Попробовать снова</Button></p>
             </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <Card className="w-full max-w-2xl animate-in fade-in-50">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">{suggestions.greeting}</CardTitle>
                    <CardDescription className="text-lg">{suggestions.mainSuggestion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h3 className="font-semibold">Ваши первые квесты:</h3>
                     {suggestions.suggestions.map((quest) => {
                        const Icon = iconMap[quest.icon] || LucideIcons.HelpCircle;
                        return (
                             <Link href={quest.href} key={quest.title} className="block">
                                <Card className="hover:bg-muted/50 transition-colors">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Icon className="h-8 w-8 text-primary" />
                                        <div className="flex-1">
                                            <p className="font-semibold">{quest.title}</p>
                                            <p className="text-sm text-muted-foreground">{quest.description}</p>
                                        </div>
                                        {quest.reward && (
                                            <div className="text-sm font-bold text-green-500">{quest.reward}</div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full" size="lg">
                        <Link href="/dashboard">Перейти на главную <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
