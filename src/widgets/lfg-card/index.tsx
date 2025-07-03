'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Clock, Gamepad2, Dumbbell, MapPin, Users, UserPlus } from 'lucide-react';
import type { LfgLobby } from '@/app/providers/lfg-provider';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface LfgCardProps {
    lobby: LfgLobby;
    onJoin: (lobbyId: string) => void;
}

export function LfgCard({ lobby, onJoin }: LfgCardProps) {
    const Icon = lobby.type === 'training' ? Dumbbell : Gamepad2;

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{lobby.sport}</CardTitle>
                    </div>
                    <Badge variant={lobby.playersJoined >= lobby.playersNeeded ? 'destructive' : 'default'}>
                        <Users className="mr-1.5 h-3 w-3" />
                        {lobby.playersJoined}/{lobby.playersNeeded}
                    </Badge>
                </div>
                <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                    <MapPin className="h-3 w-3" /> {lobby.location}
                </CardDescription>
                <CardDescription className="flex items-center gap-1.5 text-xs">
                    <Clock className="h-3 w-3" /> {format(new Date(lobby.startTime), 'd MMMM, HH:mm', { locale: ru })}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground italic">&quot;{lobby.comment}&quot;</p>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={lobby.creator.avatar} />
                        <AvatarFallback>{lobby.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>Создал: {lobby.creator.name}</span>
                </div>
                <Button 
                    className="w-full"
                    onClick={() => onJoin(lobby.id)}
                    disabled={lobby.playersJoined >= lobby.playersNeeded}
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {lobby.playersJoined >= lobby.playersNeeded ? 'Лобби заполнено' : 'Присоединиться'}
                </Button>
            </CardFooter>
        </Card>
    );
}
