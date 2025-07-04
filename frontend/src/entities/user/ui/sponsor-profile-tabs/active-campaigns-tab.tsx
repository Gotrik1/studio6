
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import type { Promotion } from '@/shared/lib/mock-data/promotions';
import { Button } from "@/shared/ui/button";
import { Megaphone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';

interface ActiveCampaignsTabProps {
    campaigns: Promotion[];
}

export function ActiveCampaignsTab({ campaigns }: ActiveCampaignsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Активные промо-кампании</CardTitle>
                <CardDescription>Запущенные вами конкурсы и акции для сообщества.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((promo) => (
                    <Card key={promo.id} className="overflow-hidden flex flex-col">
                        <div className="relative h-32 w-full">
                            <Image src={promo.image} alt={promo.title} fill className="object-cover" data-ai-hint={promo.imageHint} />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-base">{promo.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                             <p className="text-sm text-muted-foreground line-clamp-2">{promo.description}</p>
                        </CardContent>
                       <CardFooter className="flex-col items-start gap-4 p-4 pt-0">
                             <div>
                                <p className="text-xs font-semibold uppercase text-muted-foreground">Приз</p>
                                <p className="font-bold text-primary">{promo.prize}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Заканчивается: {format(new Date(promo.endDate), "d MMMM yyyy", { locale: ru })}</span>
                            </div>
                           <Button variant="outline" className="w-full" asChild>
                                <Link href="/promotions">
                                    <Megaphone className="mr-2 h-4 w-4" />
                                    Управлять акцией
                                </Link>
                           </Button>
                       </CardFooter>
                    </Card>
                ))}
                {campaigns.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-full text-center py-8">У этого спонсора нет активных кампаний.</p>
                )}
            </CardContent>
        </Card>
    );
}
