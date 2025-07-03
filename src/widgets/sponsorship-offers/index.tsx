'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { incomingSponsorshipOffers as initialOffers, type SponsorshipOffer } from '@/shared/lib/mock-data/sponsorship';
import { Check, X } from 'lucide-react';
import Image from 'next/image';

export function SponsorshipOffers() {
    const [offers, setOffers] = useState<SponsorshipOffer[]>(initialOffers);
    const { toast } = useToast();

    const handleResponse = (offerId: string, status: 'accepted' | 'declined') => {
        const offer = offers.find(o => o.id === offerId);
        if (!offer) return;

        setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status } : o));
        
        if (status === 'accepted') {
            toast({
                title: 'Предложение принято!',
                description: `Вы заключили партнерство с ${offer.sponsor.name}.`
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Предложение отклонено',
            });
        }
    };

    const pendingOffers = offers.filter(o => o.status === 'pending');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Входящие спонсорские предложения</CardTitle>
                <CardDescription>Предложения от компаний, заинтересованных в вашей команде.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {pendingOffers.length > 0 ? (
                    pendingOffers.map(offer => (
                        <Card key={offer.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <Image src={offer.sponsor.logo} alt={offer.sponsor.name} width={40} height={40} className="rounded-full border" data-ai-hint={offer.sponsor.logoHint} />
                                    <div>
                                        <p className="font-semibold">{offer.sponsor.name}</p>
                                        <p className="text-sm text-muted-foreground">{offer.offer}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleResponse(offer.id, 'declined')}><X className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="ghost" className="text-green-500" onClick={() => handleResponse(offer.id, 'accepted')}><Check className="h-4 w-4" /></Button>
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
