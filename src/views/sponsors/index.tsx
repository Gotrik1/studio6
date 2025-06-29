'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Handshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { sponsorsList } from '@/shared/lib/mock-data/sponsors';

export function SponsorsPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Спонсоры</h1>
                <p className="text-muted-foreground">
                    Найдите подходящего партнера для вашей команды.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sponsorsList.map(sponsor => (
                    <Card key={sponsor.id} className="flex flex-col">
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
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href={sponsor.profileUrl}>Профиль</Link>
                            </Button>
                            <Button>
                                <Handshake className="mr-2 h-4 w-4" />
                                Связаться
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
