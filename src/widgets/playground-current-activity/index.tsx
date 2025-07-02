'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { UserCheck } from 'lucide-react';
import { userList } from '@/shared/lib/mock-data/users';

const currentPlayers = userList.slice(0, 5); // Mock data

export function PlaygroundCurrentActivity() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Сейчас на площадке
                </CardTitle>
            </CardHeader>
            <CardContent>
                {currentPlayers.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {currentPlayers.map(player => (
                            <TooltipProvider key={player.id}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Avatar className="h-10 w-10 border-2 border-green-500">
                                            <AvatarImage src={player.avatar} alt={player.name} />
                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{player.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Сейчас здесь никого нет. Будьте первым!</p>
                )}
            </CardContent>
        </Card>
    );
}
