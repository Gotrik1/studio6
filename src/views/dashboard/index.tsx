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
                <MatchOfTheWeekWidget />
                <PollCard poll={mainPoll} />
            </aside>
        </div>
    );
}
