
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { storeItems, type StoreItem } from '@/shared/lib/mock-data/store';
import { Coins, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/shared/hooks/use-toast';

export function StorePage() {
    const { toast } = useToast();

    const handlePurchase = (item: StoreItem) => {
        toast({
            title: 'Покупка совершена!',
            description: `Вы успешно приобрели "${item.name}".`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Магазин</h1>
                <p className="text-muted-foreground">
                    Приобретайте подписки, бустеры и предметы кастомизации за ProDvor Dollars (PD).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeItems.map(item => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader className="p-0 relative h-40">
                            <Image src={item.image} alt={item.name} fill className="object-cover rounded-t-lg" data-ai-hint={item.imageHint} />
                        </CardHeader>
                        <CardContent className="p-6 flex-1">
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription className="mt-2">{item.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handlePurchase(item)}>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {item.isRealMoney ? `Купить за $${item.price}` : (
                                    <>
                                        Купить за {item.price}
                                        <Coins className="ml-1.5 h-4 w-4 text-amber-300" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
