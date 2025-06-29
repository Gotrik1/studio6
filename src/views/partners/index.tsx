
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { sponsorsList } from '@/shared/lib/mock-data/sponsors';

export function PartnersPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Наши партнеры</h1>
                <p className="text-muted-foreground">
                    Компании и организации, которые поддерживают развитие платформы ProDvor.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sponsorsList.map(sponsor => (
                     <Link key={sponsor.id} href={sponsor.profileUrl} className="block h-full">
                        <Card className="flex flex-col h-full transition-all hover:shadow-2xl hover:border-primary cursor-pointer">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Image src={sponsor.logo} alt={sponsor.name} width={64} height={64} className="rounded-lg border" data-ai-hint={sponsor.logoHint} />
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
                ))}
            </div>
        </div>
    );
}
