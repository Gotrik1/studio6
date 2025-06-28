
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { allSponsors, featuredSponsors } from "@/lib/mock-data/sponsors";
import { Badge } from "@/components/ui/badge";

export default function SponsorsPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <Handshake className="mx-auto h-16 w-16 mb-4 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Наши Партнеры и Спонсоры</h1>
                <p className="mt-2 text-lg text-muted-foreground">Компании, которые верят в нас и поддерживают развитие дворового спорта.</p>
            </div>

            <section>
                <h2 className="font-headline text-3xl font-bold mb-6">🏆 Избранные партнеры</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredSponsors.map(sponsor => (
                        <Card key={sponsor.name} className="overflow-hidden group">
                            <div className="relative h-48 bg-muted">
                                <Image src={sponsor.bannerImage} alt={`${sponsor.name} banner`} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={sponsor.bannerImageHint} />
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 shrink-0">
                                        <Image src={sponsor.logo} alt={sponsor.name} fill className="rounded-lg border p-1 bg-background object-contain" data-ai-hint={sponsor.logoHint} />
                                    </div>
                                    <div>
                                        <CardTitle>{sponsor.name}</CardTitle>
                                        <CardDescription>{sponsor.slogan}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={sponsor.websiteUrl} target="_blank">Перейти на сайт</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="font-headline text-3xl font-bold mb-6">Все спонсоры</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {allSponsors.map(sponsor => (
                        <Card key={sponsor.name} className="text-center p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="h-20 w-32 relative mb-4">
                                <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain brightness-0 dark:brightness-100" data-ai-hint={sponsor.logoHint} />
                            </div>
                            <p className="font-semibold">{sponsor.name}</p>
                            <Badge variant="secondary" className="mt-2">{sponsor.tier}</Badge>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
