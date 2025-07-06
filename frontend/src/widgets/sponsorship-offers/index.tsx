


'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { Check, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getSponsorshipOffers, respondToSponsorshipOffer } from '@/entities/sponsorship/api/offers';
import type { SponsorshipOffer } from '@/entities/sponsorship/model/types';
import { Skeleton } from '@/shared/ui/skeleton';
import { useParams } from 'next/navigation';

export function SponsorshipOffers() {
    const { toast } = useToast();
    const params = useParams<{ slug: string }>();
    const teamId = params.slug as string; // Assuming slug is the team id for this page.
    const [offers, setOffers] = useState<SponsorshipOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOffers = useCallback(async () => {
        setIsLoading(true);
        const result = await getSponsorshipOffers(teamId);
        if(result.success && result.data) {
            setOffers(result.data);
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить спонсорские предложения.' });
        }
        setIsLoading(false);
    }, [teamId, toast]);

    useEffect(() => {
        if(teamId) {
             fetchOffers();
        }
    }, [teamId, fetchOffers]);


    const handleResponse = async (offerId: string, status: 'ACCEPTED' | 'DECLINED') => {
        const offer = offers.find(o => o.id === offerId);
        if (!offer) return;
        
        const result = await respondToSponsorshipOffer(offerId, status);
        
        if (result.success) {
            toast({
                title: status === 'ACCEPTED' ? 'Предложение принято!' : 'Предложение отклонено',
                description: `Вы ответили на предложение от ${offer.sponsor.name}.`
            });
            fetchOffers(); // Refetch data
        } else {
             toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: result.error || 'Не удалось обновить статус предложения.'
            });
        }
    };

    const pendingOffers = offers.filter(o => o.status === 'PENDING');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Входящие спонсорские предложения</CardTitle>
                <CardDescription>Предложения от компаний, заинтересованных в вашей команде.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                 ) : pendingOffers.length > 0 ? (
                    pendingOffers.map(offer => (
                        <Card key={offer.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <Image src={offer.sponsor.logo} alt={offer.sponsor.name} width={40} height={40} className="rounded-full border" data-ai-hint={offer.sponsor.logoHint} />
                                    <div>
                                        <p className="font-semibold">{offer.sponsor.name}</p>
                                        <p className="text-sm text-muted-foreground">{offer.offerText}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleResponse(offer.id, 'DECLINED')}><X className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="ghost" className="text-green-500" onClick={() => handleResponse(offer.id, 'ACCEPTED')}><Check className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">У вас нет активных предложений.</p>
                )}
            </CardContent>
        </Card>
    );
}
