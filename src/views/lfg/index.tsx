'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useLfg, type LfgLobby } from '@/app/providers/lfg-provider';
import { PlusCircle, MapPin, Clock, Users, Gamepad2, UserPlus, Swords, Search, Loader2, Sparkles, Users2, GraduationCap, UserSearch, BarChart3, Shapes } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { LfgCreateDialog } from '@/widgets/lfg-create-dialog';
import { Textarea } from '@/shared/ui/textarea';
import { findLfgLobbies } from '@/shared/api/genkit/flows/find-lfg-lobbies-flow';
import type { LfgLobby as LfgLobbyType } from '@/shared/api/genkit/flows/schemas/find-lfg-lobbies-schema';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

function LfgCard({ lobby, onJoin }: { lobby: LfgLobbyType, onJoin: (lobbyId: string) => void }) {
    return (
        <Card className="flex flex-col">
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

const communityLinks = [
    { href: "/friends", icon: Users2, title: "Друзья", description: "Ваш список друзей и заявки." },
    { href: "/coaches", icon: GraduationCap, title: "Найти тренера", description: "Подберите наставника для роста." },
    { href: "/scouting", icon: UserSearch, title: "Поиск игроков", description: "Найдите новых членов команды." },
    { href: "/leaderboards", icon: BarChart3, title: "Таблицы лидеров", description: "Сравните свои результаты с лучшими." },
    { href: "/sports", icon: Shapes, title: "Виды спорта", description: "Все доступные дисциплины." },
];

const CommunityLinkCard = ({ href, icon: Icon, title, description }: (typeof communityLinks)[0]) => (
    <Card className="hover:bg-muted/50 transition-colors h-full">
        <Link href={href} className="block p-4 h-full">
            <div className="flex items-start gap-4">
                <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
        </Link>
    </Card>
);

export function LfgPage() {
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [prompt, setPrompt] = useState('Хочу поиграть в футбол вечером');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { lobbies, addLobby, joinLobby } = useLfg();
    const [filteredLobbies, setFilteredLobbies] = useState<LfgLobbyType[] | null>(null);

    const handleSearch = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите, какую игру вы ищете.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setFilteredLobbies(null);

        try {
            const searchResult = await findLfgLobbies(prompt);
            setFilteredLobbies(searchResult.recommendations);
            if (searchResult.recommendations.length === 0) {
                 toast({
                    title: "Ничего не найдено",
                    description: "Попробуйте изменить ваш запрос или создайте свое лобби.",
                });
            }
        } catch (e) {
            console.error(e);
            setError('Не удалось выполнить поиск. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoin = (lobbyId: string) => {
        joinLobby(lobbyId);
        const lobby = lobbies.find(l => l.id === lobbyId);
        if (lobby) {
            toast({
                title: "Вы присоединились к лобби!",
                description: `Вы успешно присоединились к игре по ${lobby.sport}.`,
            });
        }
    };

    const handleCreateLobby = (data: Omit<LfgLobby, 'id' | 'creator' | 'playersJoined' | 'endTime'> & { duration: number }) => {
        addLobby(data);
        toast({
            title: "Лобби создано!",
            description: "Ваш запрос на игру опубликован.",
        });
    };
    
    const lobbiesToDisplay = filteredLobbies === null ? lobbies : filteredLobbies;

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
                            Найдите компанию для игры с помощью AI или создайте свое лобби.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать лобби вручную
                    </Button>
                </div>

                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Умный поиск</CardTitle>
                        <CardDescription>Опишите своими словами, во что, где и когда вы хотите поиграть.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Например: 'Ищу с кем поиграть в баскетбол в Парке Горького сегодня вечером...'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                            className="min-h-[100px] text-base"
                        />
                         {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>Ошибка</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSearch} disabled={isLoading} size="lg" className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                            {isLoading ? 'Идет поиск...' : 'Найти игры'}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}><Skeleton className="h-80 w-full" /></Card>
                    ))}

                    {lobbiesToDisplay.map(lobby => (
                        <LfgCard key={lobby.id} lobby={lobby} onJoin={handleJoin} />
                    ))}
                </div>
                 {!isLoading && lobbiesToDisplay.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Активных лобби по вашему запросу не найдено.</p>
                        <p>Попробуйте изменить запрос или создайте свое лобби.</p>
                    </div>
                )}
                
                <div className="space-y-4 pt-6 mt-6 border-t">
                    <h2 className="font-headline text-2xl font-bold">Разделы сообщества</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {communityLinks.map(link => (
                            <CommunityLinkCard key={link.href} {...link} />
                        ))}
                    </div>
                </div>

            </div>
            <LfgCreateDialog 
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onCreate={handleCreateLobby}
            />
        </>
    );
}
