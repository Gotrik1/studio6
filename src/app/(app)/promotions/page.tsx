
'use client';

import { useState } from 'react';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { promotionsList as initialPromotionsList, sponsorsList } from "@/lib/mock-data/promotions";
import { Clock, Gift, PlusCircle, Users, CheckCircle, Coins } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { pdHistory } from '@/lib/mock-data/gamification';

type Promotion = (typeof initialPromotionsList)[0];

export default function PromotionsPage() {
    const { toast } = useToast();
    const [promotions, setPromotions] = useState<Promotion[]>(initialPromotionsList);
    const [participatedPromoIds, setParticipatedPromoIds] = useState<string[]>([]);
    const [pdBalance, setPdBalance] = useState(() => pdHistory.reduce((sum, item) => sum + item.value, 0));

    const handleParticipate = (promo: Promotion) => {
        if (pdBalance < promo.cost) {
            toast({
                variant: 'destructive',
                title: "Недостаточно средств",
                description: `Вам нужно ${promo.cost} PD для участия в этой акции.`,
            });
            return;
        }

        setPdBalance(prev => prev - promo.cost);
        setPromotions(promotions.map(p => 
            p.id === promo.id ? { ...p, participants: p.participants + 1 } : p
        ));
        setParticipatedPromoIds([...participatedPromoIds, promo.id]);
        
        toast({
            title: "Вы успешно зарегистрировались!",
            description: `Вы теперь участник акции "${promo.name}". ${promo.cost > 0 ? `С вашего счета списано ${promo.cost} PD.` : ''}`,
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Активна": return "default";
            case "Скоро": return "secondary";
            case "Завершена": return "outline";
            default: return "secondary";
        }
    };

    const activePromotions = promotions.filter(p => p.status !== 'Завершена');
    const pastPromotions = promotions.filter(p => p.status === 'Завершена');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Промо-акции</h1>
                    <p className="text-muted-foreground">
                        Участвуйте в конкурсах и акциях от наших партнеров и выигрывайте призы.
                    </p>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 font-bold text-primary shadow-inner">
                        <Coins className="h-5 w-5"/>
                        <span className="text-lg">{pdBalance.toLocaleString()} PD</span>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать акцию
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="current">
                 <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-2">
                    <TabsTrigger value="current">Текущие акции</TabsTrigger>
                    <TabsTrigger value="past">Прошедшие</TabsTrigger>
                </TabsList>
                <TabsContent value="current" className="mt-4">
                     {activePromotions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {activePromotions.map((promo) => {
                                const isParticipating = participatedPromoIds.includes(promo.id);
                                const canAfford = pdBalance >= promo.cost;
                                return (
                                <Card key={promo.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
                                    <CardHeader className="relative h-40 w-full p-0">
                                        <Image 
                                            src={promo.image} 
                                            alt={promo.name} 
                                            fill 
                                            className="object-cover"
                                            data-ai-hint={promo.imageHint}
                                        />
                                        <Badge variant={getStatusVariant(promo.status)} className="absolute right-2 top-2">{promo.status}</Badge>
                                        <Badge variant="secondary" className="absolute left-2 top-2 flex items-center gap-1">
                                            {promo.cost > 0 ? (
                                                <>
                                                   <Coins className="h-3 w-3" /> {promo.cost} PD
                                                </>
                                            ) : (
                                                'Бесплатно'
                                            )}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="flex-1 p-6">
                                        <p className="text-sm font-semibold text-primary">{promo.sponsor}</p>
                                        <CardTitle className="mt-1 font-headline">{promo.name}</CardTitle>
                                        <CardDescription className="mt-2 line-clamp-2">{promo.description}</CardDescription>
                                        <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                                            <div className="flex items-center"><Gift className="mr-1.5 h-4 w-4" />{promo.prize}</div>
                                            <div className="flex items-center"><Users className="mr-1.5 h-4 w-4" />{promo.participants}</div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 p-4">
                                        <Button 
                                            className="w-full"
                                            onClick={() => handleParticipate(promo)}
                                            disabled={isParticipating || promo.status !== 'Активна' || !canAfford}
                                        >
                                            {isParticipating ? (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Вы участвуете
                                                </>
                                            ) : (
                                                'Участвовать'
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )})}
                        </div>
                     ) : (
                        <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                            <Gift className="h-10 w-10 mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Активных акций пока нет</h3>
                            <p className="mt-1 text-muted-foreground">Загляните позже или создайте свою собственную!</p>
                        </div>
                     )}
                </TabsContent>
                <TabsContent value="past" className="mt-4">
                     {pastPromotions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {pastPromotions.map((promo) => (
                                <Card key={promo.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md opacity-70">
                                    <CardHeader className="relative h-40 w-full p-0">
                                        <Image 
                                            src={promo.image} 
                                            alt={promo.name} 
                                            fill 
                                            className="object-cover"
                                            data-ai-hint={promo.imageHint}
                                        />
                                        <Badge variant={getStatusVariant(promo.status)} className="absolute right-2 top-2">{promo.status}</Badge>
                                    </CardHeader>
                                    <CardContent className="flex-1 p-6">
                                        <p className="text-sm font-semibold text-primary">{promo.sponsor}</p>
                                        <CardTitle className="mt-1 font-headline">{promo.name}</CardTitle>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 p-4">
                                        <Button className="w-full" variant="outline" disabled>Архив</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                     ) : (
                        <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                            <Clock className="h-10 w-10 mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Архив акций пуст</h3>
                            <p className="mt-1 text-muted-foreground">Здесь будут отображаться завершенные акции и их победители.</p>
                        </div>
                     )}
                </TabsContent>
            </Tabs>
            
            <Card>
                <CardHeader>
                    <CardTitle>Наши партнеры</CardTitle>
                    <CardDescription>Компании, которые поддерживают наше сообщество и проводят акции.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-8">
                    {sponsorsList.map(sponsor => (
                        <div key={sponsor.name} className="flex flex-col items-center gap-2">
                             <Avatar className="h-20 w-20 border-2">
                                <AvatarImage src={sponsor.logo} alt={sponsor.name} className="object-contain p-2" data-ai-hint={sponsor.logoHint} />
                                <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <p className="text-sm font-medium">{sponsor.name}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
}
