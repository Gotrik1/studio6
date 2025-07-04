'use client';

import { useEffect, useState } from 'react';
import { CoachFinder } from '@/widgets/coach-finder';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import Link from 'next/link';
import { Send, Star, UserSearch } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { getCoaches } from '@/entities/coach/api/get-coaches';
import type { Coach } from '@/entities/coach/model/types';
import { Skeleton } from '@/shared/ui/skeleton';


function CoachCard({ coach }: { coach: Coach }) {
    const { toast } = useToast();
    const handleContact = () => {
        toast({
            title: "Запрос отправлен!",
            description: `Ваш запрос на тренировку отправлен тренеру ${coach.name}.`
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16 border">
                    <AvatarImage src={coach.avatar || ''} alt={coach.name} data-ai-hint={coach.avatarHint}/>
                    <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle><Link href={coach.profileUrl} className="hover:underline">{coach.name}</Link></CardTitle>
                    <CardDescription>{coach.specialization}</CardDescription>
                     <div className="flex items-center gap-1 text-sm text-amber-500 mt-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold">{coach.rating}</span>
                        <span className="text-muted-foreground">({coach.price})</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{coach.description}</p>
                <div className="flex flex-wrap gap-1">
                    {coach.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" onClick={handleContact}>
                    <Send className="mr-2 h-4 w-4"/> Связаться
                </Button>
            </CardFooter>
        </Card>
    );
}

const CoachListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
    </div>
);

export function CoachesPage() {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCoaches = async () => {
            setIsLoading(true);
            const data = await getCoaches();
            setCoaches(data);
            setIsLoading(false);
        };
        loadCoaches();
    }, []);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
             <div className="space-y-2 text-center">
                 <UserSearch className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">Найти тренера</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Воспользуйтесь AI-скаутом, чтобы найти идеального наставника для ваших целей, или просмотрите список всех доступных тренеров.
                </p>
            </div>
            <CoachFinder />
            <div className="space-y-4 pt-6 border-t">
                <h3 className="text-xl font-bold">Все тренеры</h3>
                 {isLoading ? <CoachListSkeleton /> : (
                    coaches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coaches.map(coach => <CoachCard key={coach.id} coach={coach} />)}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">На платформе пока нет зарегистрированных тренеров.</p>
                    )
                )}
            </div>
        </div>
    );
}
