
'use client';

import { useState } from 'react';
import type { PlaygroundReview } from '@/shared/lib/mock-data/playground-reviews';
import { PlaygroundReviewsFeed } from '@/widgets/playground-reviews-feed';
import { PlaygroundReviewSummary } from '@/widgets/playground-review-summary';
import { PlaygroundReviewDialog } from '@/widgets/playground-review-dialog';

interface PlaygroundReviewsTabProps {
    reviews: PlaygroundReview[];
    onAddReview: (reviewData: Omit<PlaygroundReview, 'id' | 'author' | 'timestamp'>) => void;
    playgroundName: string;
}

export function PlaygroundReviewsTab({ reviews, onAddReview, playgroundName }: PlaygroundReviewsTabProps) {
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

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
                playgroundName={playgroundName}
                onAddReview={onAddReview}
            />
        </>
    );
}
