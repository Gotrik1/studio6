'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Coins, Swords, Check, User, Trophy } from 'lucide-react';
import type { Challenge } from '@/shared/lib/mock-data/challenges';
import { cn } from '@/shared/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

interface ChallengeCardProps {
    challenge: Challenge;
    onAccept?: (challengeId: string) => void;
    isAcceptable?: boolean;
}

const statusInfo = {
    open: { label: 'Открыт', color: 'bg-green-500' },
    in_progress: { label: 'Идёт', color: 'bg-blue-500' },
    completed: { label: 'Завершен', color: 'bg-muted-foreground' }
};

export function ChallengeCard({ challenge, onAccept, isAcceptable = false }: ChallengeCardProps) {
    const { label, color } = statusInfo[challenge.status];

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <Badge variant="secondary">{challenge.discipline}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={challenge.creator.avatar} data-ai-hint={challenge.creator.avatarHint} />
                        <AvatarFallback>{challenge.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>Автор: {challenge.creator.name}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
                
                {challenge.status === 'in_progress' && challenge.opponent && (
                    <div className="mt-4 p-2 bg-muted/50 rounded-md flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 font-semibold">
                            <User className="h-4 w-4"/> {challenge.creator.name}
                        </div>
                        <Swords className="h-5 w-5 text-primary"/>
                        <div className="flex items-center gap-1.5 font-semibold">
                           <User className="h-4 w-4"/> {challenge.opponent.name}
                        </div>
                    </div>
                )}
                 {challenge.status === 'completed' && challenge.result && (
                    <div className="mt-4 p-2 bg-muted/50 rounded-md flex items-center justify-center gap-2 text-sm font-semibold">
                         <Trophy className="h-4 w-4 text-amber-500"/> {challenge.result}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-1 font-bold text-lg">
                    <Coins className="h-5 w-5 text-amber-400" />
                    <span>{challenge.wager} PD</span>
                </div>
                {challenge.status === 'open' ? (
                    isAcceptable ? (
                        <Button onClick={() => onAccept?.(challenge.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            Принять вызов
                        </Button>
                    ) : (
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                     <Button disabled>
                                        <Check className="mr-2 h-4 w-4" />
                                        Принять вызов
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Вы не можете принять собственный вызов.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                ) : (
                    <Badge variant="outline" className="flex items-center gap-1.5 pr-3">
                        <div className={cn("h-2 w-2 rounded-full", color)}></div>
                        {label}
                    </Badge>
                )}
            </CardFooter>
        </Card>
    );
}
