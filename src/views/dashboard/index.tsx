
'use client';

import { PollCard } from "@/widgets/poll-card";
import { mainPoll } from "@/shared/lib/mock-data/dashboard";
import { Feed } from '@/widgets/feed';
import { StatusUpdateForm } from '@/widgets/status-update-form';
import { AiNewsDigest } from "@/widgets/ai-news-digest";
import { MatchOfTheWeekWidget } from "@/widgets/match-of-the-week";
import { AiCoachTip } from "@/widgets/ai-coach-tip";

export function DashboardPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="opacity-0 animate-fade-in-up">
                    <AiCoachTip />
                </div>
                <div className="opacity-0 animate-fade-in-up animation-delay-300">
                    <AiNewsDigest />
                </div>
                <div className="opacity-0 animate-fade-in-up animation-delay-600">
                    <StatusUpdateForm />
                </div>
                <Feed />
            </div>
            <aside className="space-y-6 lg:sticky lg:top-[5.5rem] self-start opacity-0 animate-fade-in-up animation-delay-300">
                <MatchOfTheWeekWidget />
                <PollCard poll={mainPoll} />
            </aside>
        </div>
    );
}
