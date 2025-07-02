'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin, Check, Star, User, Home, Sparkles, Send } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useToast } from '@/shared/hooks/use-toast';

export function PlaygroundDetails({ playground }: { playground: Playground }) {
    const { toast } = useToast();

    const handleSetHome = () => {
        toast({
            title: 'Домашняя площадка установлена!',
            description: `Площадка "${playground.name}" теперь ваша домашняя.`
        });
    };

    return (
        <div className="space-y-6">
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
                     <Card>
                         <CardHeader><CardTitle>AI-сводка по площадке</CardTitle></CardHeader>
                         <CardContent>
                             <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                 <p className="text-sm italic text-muted-foreground flex items-start gap-3">
                                     <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                     <span>
                                         Это популярное место для вечерних игр, особенно по выходным. Судя по отзывам, газон в хорошем состоянии, но освещение может быть неравномерным. Рекомендуем приходить со своей компанией, так как площадка часто занята.
                                     </span>
                                 </p>
                             </div>
                         </CardContent>
                     </Card>
                     <Card>
                         <CardHeader><CardTitle>Последние чекины</CardTitle></CardHeader>
                         <CardContent>
                            <p className="text-muted-foreground text-sm">Здесь будет список игроков, которые недавно отмечались на этой площадке.</p>
                         </CardContent>
                     </Card>
                 </div>
                 <div className="space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between"><span>Покрытие:</span><span className="font-semibold">{playground.surface}</span></div>
                            <div className="flex justify-between"><span>Рейтинг:</span><span className="font-semibold flex items-center gap-1">{playground.rating}/5.0 <Star className="h-4 w-4 text-amber-500"/></span></div>
                            <div className="flex justify-between"><span>Чекинов:</span><span className="font-semibold">{playground.checkIns}</span></div>
                            <div>
                                <p>Особенности:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {playground.features.map(f => <Badge key={f}>{f}</Badge>)}
                                </div>
                            </div>
                        </CardContent>
                     </Card>
                      <Card>
                        <CardHeader><CardTitle>Создатель</CardTitle></CardHeader>
                        <CardContent className="flex items-center gap-3">
                            <Avatar><AvatarImage src={playground.creator.avatar} /><AvatarFallback>{playground.creator.name.charAt(0)}</AvatarFallback></Avatar>
                            <p className="font-semibold">{playground.creator.name}</p>
                        </CardContent>
                      </Card>
                      <div className="space-y-2">
                        <Button className="w-full" onClick={handleSetHome}><Home className="mr-2 h-4 w-4"/> Сделать домашней</Button>
                        <Button className="w-full" variant="outline"><Send className="mr-2 h-4 w-4"/> Пригласить друзей</Button>
                      </div>
                 </div>
             </div>
        </div>
    );
}
