
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSponsors } from '@/entities/sponsor/api/sponsors';
import type { Sponsor } from '@/entities/sponsor/model/types';
import { Skeleton } from '@/shared/ui/skeleton';
import { useToast } from '@/shared/hooks/use-toast';

export function PartnersPage() {
    const { toast } = useToast();
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSponsors = async () => {
            setIsLoading(true);
            try {
                const data = await getSponsors();
                setSponsors(data);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить список партнеров.';
                toast({ variant: 'destructive', title: 'Ошибка', description: errorMessage });
            } finally {
                setIsLoading(false);
            }
        };
        loadSponsors();
    }, [toast]);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Наши партнеры</h1>
                <p className="text-muted-foreground">
                    Компании и организации, которые поддерживают развитие платформы ProDvor.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </>
                ) : (
                    sponsors.map(sponsor => (
                         <Link key={sponsor.id} href={sponsor.profileUrl} className="block h-full">
                            <Card className="flex flex-col h-full transition-all hover:shadow-2xl hover:border-primary cursor-pointer">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Image src={sponsor.logo || ''} alt={sponsor.name} width={64} height={64} className="rounded-lg border" data-ai-hint={sponsor.logoHint} />
                                    <div>
                                        <CardTitle>{sponsor.name}</CardTitle>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {sponsor.interests.map(interest => (
                                                <Badge key={interest} variant="secondary">{interest}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
