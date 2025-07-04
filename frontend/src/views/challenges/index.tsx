'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Target } from 'lucide-react';
import { ChallengesBoard } from '@/widgets/challenges-board';
import { ChallengeCreateDialog } from '@/widgets/challenge-create-dialog';
import type { Challenge } from '@/entities/challenge/model/types';
import { useToast } from '@/shared/hooks/use-toast';
import { useSession } from '@/shared/lib/session/client';
import { createChallenge, getChallenges, acceptChallenge } from '@/entities/challenge/api/challenges';
import { Skeleton } from '@/shared/ui/skeleton';

type FormValues = Omit<Challenge, 'id' | 'creator' | 'status' | 'opponent' | 'result'>;

export function ChallengesPage() {
    const { user } = useSession();
    const { toast } = useToast();
    
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
    const [history, setHistory] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const fetchAllChallenges = async () => {
        setIsLoading(true);
        try {
            const [openData, myData, historyData] = await Promise.all([
                getChallenges('open'),
                getChallenges('my'),
                getChallenges('history'),
            ]);
            setChallenges(openData);
            setMyChallenges(myData);
            setHistory(historyData);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить вызовы.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(user) {
            fetchAllChallenges();
        }
    }, [user]);

    const handleCreateChallenge = async (data: FormValues) => {
        try {
            await createChallenge(data);
            toast({ title: 'Вызов брошен!', description: 'Ваш вызов опубликован и виден другим игрокам.' });
            fetchAllChallenges(); // Refresh all lists
        } catch (error) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось создать вызов.' });
        }
    };

    const handleAcceptChallenge = async (challengeId: string) => {
        if (!user) return;
        try {
            await acceptChallenge(challengeId);
            const challenge = challenges.find(c => c.id === challengeId);
            toast({ title: 'Вызов принят!', description: `Вы приняли вызов от ${challenge?.creator.name}.` });
            fetchAllChallenges(); // Refresh all lists
        } catch (error) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось принять вызов.' });
        }
    };

    return (
        <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Target className="h-8 w-8 text-primary"/>
                            <h1 className="font-headline text-3xl font-bold tracking-tight">Центр вызовов</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Бросайте публичные вызовы, принимайте чужие и соревнуйтесь за PD и славу.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Бросить вызов
                    </Button>
                </div>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                ) : (
                    <ChallengesBoard
                        openChallenges={challenges}
                        myChallenges={myChallenges}
                        history={history}
                        onAccept={handleAcceptChallenge}
                        currentUser={user}
                    />
                )}
            </div>
            <ChallengeCreateDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} onCreate={handleCreateChallenge} />
        </>
    );
}
