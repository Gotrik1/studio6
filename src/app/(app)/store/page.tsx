
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { pdHistory, storeItems, lootboxPrizes } from '@/lib/mock-data';
import { Coins, Gem, Palette, Shield, ShoppingCart, Gift, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Prize = (typeof lootboxPrizes)[0];

export default function StorePage() {
    const { toast } = useToast();
    const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
    const totalPd = pdHistory.reduce((sum, item) => sum + item.value, 0);

    // State for lootbox opening
    const [isLootboxOpen, setIsLootboxOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [wonPrize, setWonPrize] = useState<Prize | null>(null);
    const [spinningPrize, setSpinningPrize] = useState<Prize>(lootboxPrizes[0]);

    const handlePurchase = (itemId: string, itemName: string) => {
        setPurchasedItems([...purchasedItems, itemId]);
        toast({
            title: "Покупка совершена!",
            description: `Вы успешно разблокировали: ${itemName}.`,
        });
    };

    const handleLootboxOpen = () => {
        if (totalPd < 100) {
            toast({
                variant: 'destructive',
                title: "Недостаточно средств",
                description: "Вам нужно больше PD, чтобы открыть кейс.",
            });
            return;
        }

        setIsLootboxOpen(true);
        setIsSpinning(true);
        setWonPrize(null);

        const spinDuration = 3000; // 3 seconds
        const intervalTime = 100; // update every 100ms
        let spinInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * lootboxPrizes.length);
            setSpinningPrize(lootboxPrizes[randomIndex]);
        }, intervalTime);

        setTimeout(() => {
            clearInterval(spinInterval);
            const finalPrizeIndex = Math.floor(Math.random() * lootboxPrizes.length);
            const finalPrize = lootboxPrizes[finalPrizeIndex];
            setWonPrize(finalPrize);
            setIsSpinning(false);
            toast({
                title: "Вы выиграли приз!",
                description: `Вам выпал предмет: ${finalPrize.name}`,
            });
            // In a real app, deduct PD and add item to inventory here
        }, spinDuration);
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

            <Card className="border-2 border-primary/50 bg-gradient-to-br from-card to-primary/10 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="flex items-center justify-center p-6">
                        <Image src="https://placehold.co/200x200.png" alt="Lootbox" width={200} height={200} data-ai-hint="treasure chest" className="drop-shadow-lg"/>
                    </div>
                    <div className="md:col-span-2 p-6">
                        <CardTitle className="font-headline text-2xl">Кейс "Летний сезон"</CardTitle>
                        <CardDescription>Откройте кейс и получите случайный эксклюзивный предмет этого сезона. Шанс выпадения редкого предмета — 5%!</CardDescription>
                        <div className="mt-4 flex items-center gap-4">
                            <Button size="lg" className="font-bold" onClick={handleLootboxOpen}>
                                <Gift className="mr-2 h-5 w-5" />
                                Открыть за 100 PD
                            </Button>
                            <p className="text-sm text-muted-foreground">Содержит рамки, темы и значки.</p>
                        </div>
                    </div>
                </div>
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

            <Dialog open={isLootboxOpen} onOpenChange={setIsLootboxOpen}>
                <DialogContent className="sm:max-w-[425px] text-center p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="font-headline text-2xl text-center">Открытие кейса</DialogTitle>
                        <DialogDescription className="text-center">
                            Удачи! Ваш приз вот-вот появится...
                        </DialogDescription>
                    </DialogHeader>
                    <div className="h-56 flex flex-col items-center justify-center bg-muted/50">
                        {isSpinning && (
                            <div className="flex flex-col items-center justify-center">
                                <Image src={spinningPrize.image} alt="Spinning prize" width={100} height={100} className="animate-pulse" data-ai-hint="generic prize" />
                                <p className="mt-4 font-semibold text-lg">{spinningPrize.name}</p>
                            </div>
                        )}
                        {wonPrize && (
                             <div className="flex flex-col items-center justify-center">
                                <Sparkles className="h-6 w-6 text-amber-400 absolute top-10 left-10" />
                                <Sparkles className="h-8 w-8 text-amber-400 absolute top-20 right-5" />
                                <Sparkles className="h-6 w-6 text-amber-400 absolute bottom-10 right-10" />
                                <Image src={wonPrize.image} alt={wonPrize.name} width={128} height={128} className="drop-shadow-lg" data-ai-hint={wonPrize.imageHint} />
                                <p className={cn("mt-2 font-bold text-2xl", 
                                    wonPrize.rarity === 'Редкий' ? 'text-blue-500' : 
                                    wonPrize.rarity === 'Эпический' ? 'text-purple-500' : 'text-foreground'
                                )}>{wonPrize.name}</p>
                                <Badge variant={wonPrize.rarity === 'Эпический' ? 'destructive' : wonPrize.rarity === 'Редкий' ? 'default' : 'secondary'} className="mt-1">{wonPrize.rarity}</Badge>
                             </div>
                        )}
                    </div>
                    <div className="p-6 pt-0">
                        <Button className="w-full" onClick={() => setIsLootboxOpen(false)} disabled={isSpinning}>
                            {isSpinning ? 'Крутится...' : 'Отлично!'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
