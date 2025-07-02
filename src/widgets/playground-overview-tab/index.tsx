'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import Link from 'next/link';
import { Home, Star, User } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/ui/alert-dialog";
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { AiPlaygroundSummary } from '@/widgets/ai-playground-summary';
import { AiPlaygroundLore } from '@/widgets/ai-playground-lore';
import { teams } from '@/shared/lib/mock-data/teams';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';

interface PlaygroundOverviewTabProps {
    playground: Playground;
}

export function PlaygroundOverviewTab({ playground }: PlaygroundOverviewTabProps) {
    const { toast } = useToast();
    const homeTeams = teams.filter(team => team.homePlaygroundId === playground.id);

    const handleSetHome = () => {
        toast({
            title: 'Домашняя площадка установлена!',
            description: `Площадка "${playground.name}" теперь ваша домашняя.`
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <AiPlaygroundSummary playground={playground} />
                <AiPlaygroundLore playground={playground} />
            </div>
            <div className="lg:col-span-1 space-y-6">
                 {homeTeams.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5 text-primary" />Хозяева площадки</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            {homeTeams.map(team => (
                                <Link key={team.slug} href={`/teams/${team.slug}`}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Avatar className="h-12 w-12 border-2 hover:border-primary">
                                                    <AvatarImage src={team.logo} data-ai-hint={team.dataAiHint} />
                                                    <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{team.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                )}
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
                        <Avatar>
                            <AvatarImage src={playground.creator.avatar} />
                            <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                       <p className="font-semibold">{playground.creator.name}</p>
                   </CardContent>
                 </Card>
                 <div className="space-y-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full"><Home className="mr-2 h-4 w-4"/> Сделать домашней</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Вы собираетесь отметить эту площадку как вашу &quot;домашнюю&quot;. Помните, что это общественное место. В случае препятствования играм других команд (физически, угрозами или иным способом), ваша команда и все ее участники будут дисквалифицированы на срок от 1 года до пожизненного.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSetHome}>Подтвердить</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 </div>
            </div>
        </div>
    );
}
