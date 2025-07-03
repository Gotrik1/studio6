
'use client';

import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { KingOfTheCourtWidget } from '@/widgets/playground-home-team';
import { AiPlaygroundSummary } from '@/widgets/ai-playground-summary';


export default function PlaygroundDetailsPage({ playground }: { playground: Playground }) {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <Card className="overflow-hidden">
                <div className="relative h-64 w-full">
                    <Image src={playground.coverImage} alt={playground.name} fill className="object-cover" data-ai-hint={playground.coverImageHint}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <Badge variant="secondary">{playground.type}</Badge>
                        <h1 className="font-headline text-4xl font-bold mt-1">{playground.name}</h1>
                        <p className="flex items-center gap-2 mt-1"><MapPin className="h-4 w-4" /> {playground.address}</p>
                    </div>
                </div>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <AiPlaygroundSummary playground={playground} />
                    {/* Placeholder for future content like activity feed */}
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <KingOfTheCourtWidget playgroundId={playground.id} />
                     {/* Placeholder for future content like challenges */}
                </div>
            </div>
        </div>
    );
}
