
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { pdHistory, storeItems } from '@/lib/mock-data';
import { Coins, Gem, Palette, Shield, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function StorePage() {
    const { toast } = useToast();
    const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
    
    // In a real app, this balance would come from a user session or API call
    const totalPd = pdHistory.reduce((sum, item) => sum + item.value, 0);

    const handlePurchase = (itemId: string, itemName: string) => {
        setPurchasedItems([...purchasedItems, itemId]);
        toast({
            title: "Покупка совершена!",
            description: `Вы успешно разблокировали: ${itemName}.`,
        });
        // In a real app, you would also deduct the PD from the user's balance
    };

    const getItemTypeIcon = (type: string) => {
        switch (type) {
            case 'theme': return <Palette className="mr-2 h-4 w-4" />;
            case 'badge': return <Shield className="mr-2 h-4 w-4" />;
            case 'frame': return <Gem className="mr-2 h-4 w-4" />;
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="relative flex h-40 flex-col items-center justify-center bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
                    <Gem className="h-16 w-16 mb-2 opacity-20" />
                    <CardTitle className="font-headline text-4xl">Магазин ProDvor</CardTitle>
                    <CardDescription className="text-lg text-primary-foreground/80">
                        Потратьте свои PD на уникальные предметы кастомизации.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-end gap-4 border-t bg-muted/50 p-4">
                    <p className="font-semibold">Ваш баланс:</p>
                    <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-1 font-bold text-primary shadow-inner">
                        <Coins className="h-5 w-5"/>
                        <span className="text-lg">{totalPd.toLocaleString()} PD</span>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">Личные предметы</TabsTrigger>
                    <TabsTrigger value="team">Командные предметы</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="mt-4">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {storeItems.map((item) => {
                            const canAfford = totalPd >= item.price;
                            const isPurchased = purchasedItems.includes(item.id);

                            return (
                                <Card key={item.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                                    <div className="relative">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={600}
                                            height={400}
                                            className="aspect-video w-full object-cover"
                                            data-ai-hint={item.imageHint}
                                        />
                                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-bold text-white">
                                            <Coins className="h-3 w-3 text-amber-300" />
                                            {item.price.toLocaleString()} PD
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-lg">{item.name}</CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs">{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                           {getItemTypeIcon(item.type)}
                                           <span className="capitalize">{item.type === 'theme' ? 'Тема профиля' : item.type === 'badge' ? 'Значок' : 'Рамка'}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/30 p-4">
                                        {isPurchased ? (
                                            <Button className="w-full" disabled>Приобретено</Button>
                                        ) : canAfford ? (
                                            <Button className="w-full" onClick={() => handlePurchase(item.id, item.name)}>
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                Купить
                                            </Button>
                                        ) : (
                                            <Button asChild variant="secondary" className="w-full">
                                                <Link href="/pd-economy">
                                                    <Coins className="mr-2 h-4 w-4" />
                                                    Заработать PD
                                                </Link>
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
                <TabsContent value="team" className="mt-4">
                    <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                        <ShoppingCart className="h-12 w-12 mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">Магазин для команд скоро появится</h3>
                        <p className="mt-2 text-muted-foreground">Здесь капитаны смогут приобретать кастомизацию для своей команды.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
