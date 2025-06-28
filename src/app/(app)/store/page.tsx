
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { pdHistory, storeItems, lootboxPrizes, partnerOffers, ticketEvents, recentDonors } from '@/lib/mock-data';
import { Coins, Gem, Palette, Shield, ShoppingCart, Gift, Sparkles, X, Handshake, Heart, Ticket, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

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

    const handlePurchase = (itemName: string, itemPrice: number) => {
        toast({
            title: "Поздравляем с покупкой!",
            description: `"${itemName}" теперь в вашей коллекции. Вы стали еще уникальнее!`,
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
                title: "Вот это удача!",
                description: `Из кейса выпал предмет: "${finalPrize.name}"! Поздравляем!`,
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
                        Центр экономики вашей игровой вселенной.
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

            <Tabs defaultValue="customization">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="customization"><ShoppingBag className="mr-2 h-4 w-4"/>Кастомизация</TabsTrigger>
                    <TabsTrigger value="partners"><Handshake className="mr-2 h-4 w-4"/>Магазин партнеров</TabsTrigger>
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
                                            ) : (
                                                <Button className="w-full" onClick={() => handlePurchase(item.name, item.price)} disabled={!canAfford}>
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
                
                <TabsContent value="partners" className="mt-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {partnerOffers.map(offer => (
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
                                    <Button className='w-full' onClick={() => handlePurchase(offer.title, offer.price)} disabled={totalPd < offer.price}>
                                        <Handshake className='mr-2 h-4 w-4'/>
                                        Получить за {offer.price} PD
                                    </Button>
                                    {totalPd < offer.price && <p className='text-xs text-destructive text-center'>Недостаточно PD</p>}
                                </CardFooter>
                            </Card>
                        ))}
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
                        {ticketEvents.map(event => (
                            <Card key={event.id} className="flex flex-col overflow-hidden">
                                <CardHeader className='p-0 relative h-40'>
                                     <Image src={event.image} alt={event.name} fill className='object-cover' data-ai-hint={event.imageHint} />
                                </CardHeader>
                                <CardContent className='p-4 flex-1'>
                                    <CardTitle>{event.name}</CardTitle>
                                    <CardDescription>{event.date} - {event.location}</CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Button className='w-full' onClick={() => handlePurchase(`Билет на ${event.name}`, event.price)} disabled={totalPd < event.price}>
                                        <Ticket className='mr-2 h-4 w-4' />
                                        Купить билет за {event.price} PD
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
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
