
'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { promotionsList } from '@/shared/lib/mock-data/promotions';
import { Megaphone, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function PromotionsPage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Промо-акции и конкурсы</h1>
                    <p className="text-muted-foreground">
                        Участвуйте в эксклюзивных событиях от наших партнеров и выигрывайте ценные призы.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/promotions/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать промо-акцию
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {promotionsList.map(promo => (
                    <Card key={promo.id} className="flex flex-col overflow-hidden">
                        <div className="relative h-48 w-full">
                            <Image src={promo.image} alt={promo.title} fill className="object-cover" data-ai-hint={promo.imageHint} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <CardTitle className="absolute bottom-4 left-4 text-white font-headline text-2xl shadow-lg">{promo.title}</CardTitle>
                        </div>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Image src={promo.sponsor.logo} alt={promo.sponsor.name} width={24} height={24} className="rounded-full" data-ai-hint={promo.sponsor.logoHint} />
                                <span className="text-sm font-medium">от {promo.sponsor.name}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground">{promo.description}</p>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase text-muted-foreground">Приз</p>
                                <p className="font-bold text-primary">{promo.prize}</p>
                            </div>
                            <Button className="w-full">
                                <Megaphone className="mr-2 h-4 w-4" />
                                Участвовать
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
