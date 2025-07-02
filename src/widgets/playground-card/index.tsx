
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin, Check, Star } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

export function PlaygroundCard({ playground }: { playground: Playground }) {
    return (
        <Link href={`/playgrounds/${playground.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary">
                <div className="relative h-40 w-full">
                    <Image src={playground.coverImage} alt={playground.name} fill className="object-cover" data-ai-hint={playground.coverImageHint}/>
                </div>
                <CardHeader>
                    <CardTitle>{playground.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                        <MapPin className="h-3 w-3" /> {playground.address}
                    </CardDescription>
                </CardHeader>
                 <CardContent className="flex-1">
                     <div className="flex flex-wrap gap-1">
                        {playground.features.map(feature => <Badge key={feature} variant="secondary">{feature}</Badge>)}
                    </div>
                 </CardContent>
                <CardFooter className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Check className="h-3 w-3"/>{playground.checkIns} чекинов</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400"/>{playground.rating}/5.0</span>
                </CardFooter>
            </Card>
        </Link>
    );
}
