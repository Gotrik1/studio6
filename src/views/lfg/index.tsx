
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { initialLfgLobbies, type LfgLobby } from '@/shared/lib/mock-data/lfg';
import { PlusCircle, MapPin, Clock, Users, Gamepad2, UserPlus, Swords } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { LfgCreateDialog } from '@/widgets/lfg-create-dialog';

export function LfgPage() {
    const { toast } = useToast();
    const [lobbies, setLobbies] = useState<LfgLobby[]>(initialLfgLobbies);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleJoin = (lobbyId: string) => {
        setLobbies(prevLobbies => prevLobbies.map(lobby => {
            if (lobby.id === lobbyId && lobby.playersJoined < lobby.playersNeeded) {
                toast({
                    title: "Вы присоединились к лобби!",
                    description: `Вы успешно присоединились к игре по ${lobby.sport}.`,
                });
                return { ...lobby, playersJoined: lobby.playersJoined + 1 };
            }
            return lobby;
        }));
    };

    const handleCreateLobby = (newLobbyData: Omit<LfgLobby, 'id' | 'creator' | 'playersJoined'>) => {
        const newLobby: LfgLobby = {
            id: `lfg-${Date.now()}`,
            creator: { name: 'Вы', avatar: 'https://placehold.co/100x100.png' },
            playersJoined: 1,
            ...newLobbyData
        };
        setLobbies(prev => [newLobby, ...prev]);
    };

    return (
        <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Swords className="h-8 w-8 text-primary"/>
                            <h1 className="font-headline text-3xl font-bold tracking-tight">Поиск игры (LFG)</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Найдите компанию для игры или создайте свое лобби.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать лобби
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lobbies.map(lobby => (
                        <Card key={lobby.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Gamepad2 className="h-5 w-5 text-primary" />
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
                                    <Clock className="h-3 w-3" /> {lobby.time}
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
                                    onClick={() => handleJoin(lobby.id)}
                                    disabled={lobby.playersJoined >= lobby.playersNeeded}
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    {lobby.playersJoined >= lobby.playersNeeded ? 'Лобби заполнено' : 'Присоединиться'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                 {lobbies.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Активных лобби нет. Станьте первым!</p>
                    </div>
                )}
            </div>
            <LfgCreateDialog 
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onCreate={handleCreateLobby}
            />
        </>
    );
}
