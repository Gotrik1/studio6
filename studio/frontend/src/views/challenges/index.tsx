'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Target } from 'lucide-react';
import { challengesList as initialChallenges } from '@/shared/lib/mock-data/challenges';
import { ChallengesBoard } from '@/widgets/challenges-board';
import { ChallengeCreateDialog } from '@/widgets/challenge-create-dialog';
import type { Challenge } from '@/shared/lib/mock-data/challenges';
import { useToast } from '@/shared/hooks/use-toast';
import { useSession } from '@/shared/lib/session/client';

export function ChallengesPage() {
    const { user } = useSession();
    const { toast } = useToast();
    const [challenges, setChallenges] = useState(initialChallenges);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleCreateChallenge = (data: Omit<Challenge, 'id' | 'creator' | 'status'>) => {
        if (!user) return;
        const newChallenge: Challenge = {
            id: `challenge-${Date.now()}`,
            creator: {
                name: user.name,
                avatar: user.avatar,
                avatarHint: 'user avatar'
            },
            status: 'open',
            ...data
        };
        setChallenges(prev => [newChallenge, ...prev]);
        toast({ title: 'Вызов брошен!', description: 'Ваш вызов опубликован и виден другим игрокам.' });
    };

    const handleAcceptChallenge = (challengeId: string) => {
        if (!user) return;
        setChallenges(prev => prev.map(c => 
            c.id === challengeId 
                ? { ...c, status: 'in_progress' as const, opponent: { name: user.name, avatar: user.avatar, avatarHint: 'user avatar' } } 
                : c
        ));
        const challenge = challenges.find(c => c.id === challengeId);
        toast({ title: 'Вызов принят!', description: `Вы приняли вызов от ${challenge?.creator.name}.` });
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
                <ChallengesBoard challenges={challenges} onAccept={handleAcceptChallenge} currentUser={user} />
            </div>
            <ChallengeCreateDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} onCreate={handleCreateChallenge} />
        </>
    );
}
