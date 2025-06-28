
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { pdHistory } from '@/lib/mock-data/gamification';
import { storeItems, lootboxPrizes, partnerOffers, ticketEvents, recentDonors } from '@/lib/mock-data/store';
import { Coins, Gem, Palette, Shield, ShoppingCart, Handshake, Heart, Ticket, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type StoreItem = (typeof storeItems)[0];
type Prize = (typeof lootboxPrizes)[0];

type InventoryItem = {
    id: string;
    name: string;
    description: string;
    image: string;
    imageHint: string;
    type: string;
};

const generateRoulettePrizes = (): Prize[] => {
    const reel: Prize[] = [];
    // Create a long list for a good visual spin
    for (let i = 0; i < 5; i++) {
        reel.push(...[...lootboxPrizes].sort(() => Math.random() - 0.5));
    }
    return reel;
};

export default function StorePage() {
    const { toast } = useToast();
    const [pdBalance, setPdBalance] = useState(() => pdHistory.reduce((sum, item) => sum + item.value, 0));
    const [purchasedItemIds, setPurchasedItemIds] = useState<string[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    
    // Lootbox state
    const [isLootboxOpen, setIsLootboxOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [wonPrize, setWonPrize] = useState<Prize | null>(null);
    const [roulettePrizes, setRoulettePrizes] = useState<Prize[]>([]);
    const [winningIndex, setWinningIndex] = useState<number | null>(null);
    const rouletteRef = useRef<HTMLDivElement>(null);

    const handlePurchase = (item: StoreItem) => {
        if (pdBalance < item.price) {
            toast({
                variant: 'destructive',
                title: "Недостаточно средств",
                description: `Вам нужно ${item.price.toLocaleString()} PD для этой покупки.`,
            });
            return;
        }

        setPdBalance(prev => prev - item.price);
        setPurchasedItemIds(prev => [...prev, item.id]);
        setInventory(prev => [...prev, item]);

        toast({
            title: "Поздравляем с покупкой!",
            description: `'${item.name}' добавлен в ваш инвентарь.`,
        });
    };

    const handleLootboxOpen = () => {
        if (pdBalance < 100) {
            toast({ variant: 'destructive', title: "Недостаточно средств", description: "Вам нужно 100 PD, чтобы открыть кейс." });
            return;
        }

        setPdBalance(prev => prev - 100);
        
        // Reset state for a new spin
        setWonPrize(null);
        setIsSpinning(true);
        if (rouletteRef.current) {
            rouletteRef.current.style.transition = 'none';
            rouletteRef.current.style.transform = 'translateX(0px)';
        }

        // Generate a new reel
        const newReel = generateRoulettePrizes();
        const finalPrize = lootboxPrizes[Math.floor(Math.random() * lootboxPrizes.length)];
        // Ensure the winning prize is somewhere towards the end for a good spin
        const targetIndex = newReel.length - 5;
        newReel[targetIndex] = finalPrize;
        
        setRoulettePrizes(newReel);
        setWinningIndex(targetIndex);
        setIsLootboxOpen(true);

        // Start animation after a short delay to allow DOM to update
        setTimeout(() => {
            if (rouletteRef.current) {
                // Each item is 144px wide (w-36), centered on the 3rd visible item
                const prizeWidth = 144;
                const offset = rouletteRef.current.clientWidth / 2 - prizeWidth / 2;
                const targetPosition = targetIndex * prizeWidth;
                
                rouletteRef.current.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)';
                rouletteRef.current.style.transform = `translateX(-${targetPosition - offset}px)`;
            }
        }, 100);
    };

    const handleTransitionEnd = () => {
        setIsSpinning(false);
        if (winningIndex !== null) {
            const finalPrize = roulettePrizes[winningIndex];
            setWonPrize(finalPrize);
            
            const prizeAsInventoryItem: InventoryItem = {
                 id: `prize-${finalPrize.name}-${Date.now()}`, 
                 name: finalPrize.name,
                 image: finalPrize.image,
                 imageHint: finalPrize.imageHint,
                 type: 'lootbox-prize',
                 description: `Редкость: ${finalPrize.rarity}`
            };
            setInventory(prev => [...prev, prizeAsInventoryItem]);

            toast({
                title: "Вот это удача!",
                description: `Предмет '${finalPrize.name}' добавлен в ваш инвентарь!`,
            });
        }
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
                        Центр экономики вашей игровой вселенной.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-end gap-4 border-t bg-muted/50 p-4">
                    <p className="font-semibold">Ваш баланс:</p>
                    <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-1 font-bold text-primary shadow-inner">
                        <Coins className="h-5 w-5"/>
                        <span className="text-lg">{pdBalance.toLocaleString()} PD</span>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="customization">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="customization"><Palette className="mr-2 h-4 w-4"/>Кастомизация</TabsTrigger>
                    <TabsTrigger value="inventory"><ShoppingBag className="mr-2 h-4 w-4"/>Инвентарь</TabsTrigger>
                    <TabsTrigger value="partners"><Handshake className="mr-2 h-4 w-4"/>Партнеры</TabsTrigger>
                    <TabsTrigger value="donations"><Heart className="mr-2 h-4 w-4"/>Донаты</TabsTrigger>
                    <TabsTrigger value="tickets"><Ticket className="mr-2 h-4 w-4"/>Билеты</TabsTrigger>
                </TabsList>
                
                <TabsContent value="customization" className="mt-4">
                    <div className="space-y-6">
                        <Card className="border-2 border-primary/50 bg-gradient-to-br from-card to-primary/10 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3">
                                <div className="flex items-center justify-center p-6">
                                    <Image src="https://placehold.co/200x200.png" alt="Lootbox" width={200} height={200} data-ai-hint="treasure chest" className="drop-shadow-lg"/>
                                </div>
                                <div className="md:col-span-2 p-6">
                                    <CardTitle className="font-headline text-2xl">Кейс &quot;Летний сезон&quot;</CardTitle>
                                    <CardDescription>Откройте кейс и получите случайный эксклюзивный предмет этого сезона. Шанс выпадения редкого предмета — 5%!</CardDescription>
                                    <div className="mt-4 flex items-center gap-4">
                                        <Button size="lg" className="font-bold" onClick={handleLootboxOpen}>
                                            <Gem className="mr-2 h-5 w-5" />
                                            Открыть за 100 PD
                                        </Button>
                                        <p className="text-sm text-muted-foreground">Содержит рамки, темы и значки.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {storeItems.map((item) => {
                                const canAfford = pdBalance >= item.price;
                                const isPurchased = purchasedItemIds.includes(item.id);

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
                                            ) : (
                                                <Button className="w-full" onClick={() => handlePurchase(item)} disabled={!canAfford}>
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    Купить
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="inventory" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ваш инвентарь</CardTitle>
                            <CardDescription>Предметы, полученные из кейсов или купленные в магазине.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {inventory.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {inventory.map((item) => (
                                        <Card key={item.id} className="p-4 flex flex-col items-center text-center">
                                            <Image src={item.image} alt={item.name} width={80} height={80} data-ai-hint={item.imageHint} />
                                            <p className="mt-2 text-sm font-semibold">{item.name}</p>
                                            <Badge variant="secondary" className="mt-1 capitalize">{item.type.replace('-', ' ')}</Badge>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-10">
                                    <ShoppingBag className="mx-auto h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Инвентарь пуст</h3>
                                    <p>Открывайте кейсы или покупайте предметы, чтобы пополнить свою коллекцию.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="partners" className="mt-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {partnerOffers.map(offer => {
                            const canAfford = pdBalance >= offer.price;
                            return (
                            <Card key={offer.id}>
                                <CardHeader className='flex-row items-center gap-4'>
                                    <Image src={offer.logo} alt={offer.sponsor} width={100} height={40} data-ai-hint={offer.logoHint} className='rounded-md' />
                                    <div className='flex-1'>
                                        <CardTitle>{offer.title}</CardTitle>
                                        <CardDescription>{offer.sponsor}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-sm text-muted-foreground'>{offer.description}</p>
                                </CardContent>
                                <CardFooter className='flex-col items-stretch gap-2'>
                                    <Button className='w-full' onClick={() => {
                                        if (!canAfford) {
                                            toast({ variant: 'destructive', title: "Недостаточно средств"});
                                            return;
                                        }
                                        setPdBalance(p => p - offer.price);
                                        toast({ title: "Предложение активировано!", description: `Промокод для '${offer.title}' будет отправлен вам в личные сообщения.` });
                                    }} disabled={!canAfford}>
                                        <Handshake className='mr-2 h-4 w-4'/>
                                        Получить за {offer.price} PD
                                    </Button>
                                    {!canAfford && <p className='text-xs text-destructive text-center'>Недостаточно PD</p>}
                                </CardFooter>
                            </Card>
                        )})}
                    </div>
                </TabsContent>

                <TabsContent value="donations" className="mt-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Фонд поддержки молодых талантов</CardTitle>
                                <CardDescription>Ваши PD помогут юным командам оплатить участие в турнирах, купить инвентарь или арендовать площадку. Каждый донат имеет значение!</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <Input type='number' placeholder='Сумма в PD' className='max-w-xs' />
                                <Button onClick={() => toast({ title: "Спасибо за вашу поддержку!", description: "Ваше пожертвование поможет будущим чемпионам."})}>
                                    <Heart className='mr-2 h-4 w-4'/>
                                    Пожертвовать
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Недавние донаты</CardTitle>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                {recentDonors.map(donor => (
                                    <div key={donor.id} className="flex items-center justify-between">
                                        <div className='flex items-center gap-2'>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={donor.avatar} alt={donor.name} data-ai-hint={donor.avatarHint} />
                                                <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className='text-sm font-medium'>{donor.name}</span>
                                        </div>
                                        <span className='text-sm font-bold text-primary'>{donor.amount.toLocaleString()} PD</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tickets" className="mt-4">
                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {ticketEvents.map(event => {
                            const canAfford = pdBalance >= event.price;
                            return (
                            <Card key={event.id} className="flex flex-col overflow-hidden">
                                <CardHeader className='p-0 relative h-40'>
                                     <Image src={event.image} alt={event.name} fill className='object-cover' data-ai-hint={event.imageHint} />
                                </CardHeader>
                                <CardContent className='p-4 flex-1'>
                                    <CardTitle>{event.name}</CardTitle>
                                    <CardDescription>{event.date} - {event.location}</CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Button className='w-full' onClick={() => {
                                        if (!canAfford) {
                                            toast({ variant: 'destructive', title: "Недостаточно средств"});
                                            return;
                                        }
                                        setPdBalance(p => p - event.price);
                                        toast({ title: "Билет куплен!", description: `Билет на '${event.name}' добавлен в ваш профиль.` });
                                    }} disabled={!canAfford}>
                                        <Ticket className='mr-2 h-4 w-4' />
                                        Купить билет за {event.price} PD
                                    </Button>
                                </CardFooter>
                            </Card>
                        )})}
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
                    <div className="h-56 flex flex-col items-center justify-center bg-muted/50 relative overflow-hidden">
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0.5 h-full bg-primary/50 z-10"></div>
                         <div
                            ref={rouletteRef}
                            className="flex h-full items-center"
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {roulettePrizes.map((prize, index) => (
                                <div key={index} className={cn(
                                    "flex flex-col items-center justify-center p-2 w-36 flex-shrink-0 transition-all duration-300",
                                    !isSpinning && winningIndex === index ? 'scale-110' : 'scale-90 opacity-50'
                                )}>
                                    <div className={cn('rounded-lg p-2 transition-all', !isSpinning && winningIndex === index && 'bg-primary/20')}>
                                        <Image src={prize.image} alt={prize.name} width={80} height={80} data-ai-hint={prize.imageHint} />
                                    </div>
                                    <p className="mt-2 text-xs font-semibold truncate">{prize.name}</p>
                                     <Badge variant="secondary" className={cn("transition-all", 
                                        prize.rarity === 'Редкий' ? 'border-blue-500' : 
                                        prize.rarity === 'Эпический' ? 'border-purple-500' : ''
                                    )}>{prize.rarity}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 pt-2">
                        <Button className="w-full" onClick={() => setIsLootboxOpen(false)} disabled={isSpinning}>
                            {isSpinning ? 'Крутится...' : 'Отлично!'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
