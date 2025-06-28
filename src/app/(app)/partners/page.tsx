'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { featuredSponsors, allSponsors } from "@/lib/mock-data/sponsors";
import { Badge } from "@/components/ui/badge";

const getTierVariant = (tier: string) => {
    switch(tier) {
        case 'Платиновый': return 'destructive';
        case 'Золотой': return 'default';
        case 'Серебряный': return 'secondary';
        case 'Бронзовый': return 'outline';
        default: return 'secondary';
    }
}

export default function PartnersPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <Handshake className="mx-auto h-16 w-16 mb-4 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Наши Партнеры</h1>
                <p className="mt-2 text-lg text-muted-foreground">Компании и бренды, которые верят в нас и поддерживают наше сообщество.</p>
            </div>

            <section>
                <h2 className="font-headline text-2xl font-bold mb-4">Рекомендуемые спонсоры</h2>
                <div className="space-y-6">
                    {featuredSponsors.map(sponsor => (
                        <Card key={sponsor.name} className="overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-2">
                             <div className="relative h-64 md:h-auto">
                                <Image 
                                    src={sponsor.bannerImage} 
                                    alt={`${sponsor.name} banner`}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={sponsor.bannerImageHint}
                                />
                             </div>
                             <div className="flex flex-col p-6">
                                <Image src={sponsor.logo} alt={`${sponsor.name} logo`} width={150} height={50} data-ai-hint={sponsor.logoHint} className="mb-4" />
                                <h3 className="font-headline text-2xl font-bold">{sponsor.slogan}</h3>
                                <p className="mt-2 text-muted-foreground flex-1">{sponsor.description}</p>
                                <div className="mt-4">
                                     <Button asChild>
                                        <Link href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer">
                                            Перейти на сайт
                                        </Link>
                                    </Button>
                                </div>
                             </div>
                        </Card>
                    ))}
                </div>
            </section>

             <section>
                <h2 className="font-headline text-2xl font-bold mb-4">Все партнеры</h2>
                <Card>
                    <CardContent className="p-6">
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {allSponsors.map(sponsor => (
                                <div key={sponsor.name} className="flex flex-col items-center gap-2 text-center">
                                    <div className="relative h-20 w-40">
                                        <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain" data-ai-hint={sponsor.logoHint} />
                                    </div>
                                    <p className="font-semibold">{sponsor.name}</p>
                                    <Badge variant={getTierVariant(sponsor.tier)}>{sponsor.tier}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
