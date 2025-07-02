
'use client';

import { useState } from 'react';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import type { PlaygroundReview } from '@/shared/lib/mock-data/playground-reviews';
import { mockPlaygroundReviews } from '@/shared/lib/mock-data/playground-reviews';
import { useSession } from '@/shared/lib/session/client';
import { PlaygroundReviewsFeed } from '@/widgets/playground-reviews-feed';
import { PlaygroundReviewSummary } from '@/widgets/playground-review-summary';
import { PlaygroundReviewDialog } from '@/widgets/playground-review-dialog';

interface PlaygroundReviewsTabProps {
    playground: Playground;
}

export function PlaygroundReviewsTab({ playground }: PlaygroundReviewsTabProps) {
    const { user } = useSession();
    const [reviews, setReviews] = useState<PlaygroundReview[]>(mockPlaygroundReviews);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

    const handleAddReview = (reviewData: Omit<PlaygroundReview, 'id' | 'author' | 'timestamp'>) => {
        if (!user) return;
        const newReview: PlaygroundReview = {
            id: `rev-${Date.now()}`,
            author: { name: user.name, avatar: user.avatar },
            timestamp: 'Только что',
            ...reviewData
        };
        setReviews(prev => [newReview, ...prev]);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PlaygroundReviewsFeed reviews={reviews} onAddReviewClick={() => setIsReviewDialogOpen(true)} />
                </div>
                <div className="lg:col-span-1">
                    <PlaygroundReviewSummary reviews={reviews} />
                </div>
            </div>
            <PlaygroundReviewDialog 
                isOpen={isReviewDialogOpen}
                onOpenChange={setIsReviewDialogOpen}
                playgroundName={playground.name}
                onAddReview={handleAddReview}
            />
        </>
    );
}
