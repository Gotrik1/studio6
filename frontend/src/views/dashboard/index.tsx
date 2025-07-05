'use client';

import { PollCard } from "@/widgets/poll-card";
import { Feed } from '@/widgets/feed';
import { StatusUpdateForm } from '@/widgets/status-update-form';
import { AiNewsDigest } from "@/widgets/ai-news-digest";
import { MatchPredictionWidget } from "@/widgets/match-predictions-widget";
import { AiCoachTip } from "@/widgets/ai-coach-tip";
import { useState, useEffect, useCallback } from 'react';
import { getLatestPoll, submitVote } from '@/entities/poll/api/polls';
import type { Poll } from '@/entities/poll/model/types';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';

export function DashboardPage() {
    const [poll, setPoll] = useState<Poll | null>(null);
    const { toast } = useToast();

    const loadData = useCallback(async () => {
        try {
            const pollData = await getLatestPoll();
            setPoll(pollData);
        } catch (error) {
            console.error("Failed to load poll for dashboard", error);
        }
    }, []);

     useEffect(() => {
        loadData();
    }, [loadData]);
    
     const handleVote = async (pollId: string, optionId: string) => {
        const result = await submitVote(pollId, optionId);
        if(result.success) {
            toast({ title: 'Голос учтён!' });
            loadData(); // Refetch to update poll results
            return true;
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
            return false;
        }
    };


    return (
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 opacity-0 animate-fade-in-up">
            <div className="w-full lg:w-2/3 flex-shrink-0 space-y-6">
                <div>
                    <AiCoachTip />
                </div>
                <div>
                    <AiNewsDigest />
                </div>
                <div>
                    <StatusUpdateForm />
                </div>
                <Feed />
            </div>
            <aside className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-24">
                <MatchPredictionWidget />
                {poll ? (
                    <PollCard poll={poll} onVote={handleVote} />
                ) : (
                    <Skeleton className="h-96 w-full" />
                )}
            </aside>
        </div>
    );
}
