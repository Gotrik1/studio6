
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { PlusCircle, Backpack } from 'lucide-react';
import { inventory, type InventoryItem } from '@/shared/lib/mock-data/inventory';
import Image from 'next/image';
import { differenceInMonths } from 'date-fns';
import { AiEquipmentAdvisor } from '@/widgets/ai-equipment-advisor';

const getWearPercentage = (purchaseDate: string, lifespanMonths: number) => {
    const monthsUsed = differenceInMonths(new Date(), new Date(purchaseDate));
    if (monthsUsed >= lifespanMonths) return 100;
    if (monthsUsed <= 0) return 0;
    return (monthsUsed / lifespanMonths) * 100;
};

function InventoryItemCard({ item }: { item: InventoryItem }) {
    const wearPercentage = getWearPercentage(item.purchaseDate, item.lifespanMonths);
    
    return (
        <Card>
            <CardHeader className="flex-row gap-4 items-start">
                 <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-lg border aspect-square object-cover" data-ai-hint={item.imageHint} />
                 <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.type}</CardDescription>
                 </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Износ</span>
                        <span>{wearPercentage.toFixed(0)}%</span>
                    </div>
                     <Progress value={wearPercentage} />
                </div>
            </CardContent>
        </Card>
    );
}

export function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>(inventory);
    
    return (
         <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Backpack className="h-8 w-8 text-primary"/>
                        <h1 className="font-headline text-3xl font-bold tracking-tight">Мой инвентарь</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Отслеживайте свой спортивный и игровой инвентарь, чтобы всегда быть в лучшей форме.
                    </p>
                </div>
                <Button disabled>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить предмет (Скоро)
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 self-start">
                     {items.map(item => <InventoryItemCard key={item.id} item={item} />)}
                </div>
                <div className="lg:col-span-1">
                    <AiEquipmentAdvisor />
                </div>
            </div>
        </div>
    );
}
