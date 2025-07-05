

'use client';

import { useState } from 'react';
import { PlaygroundReviewsFeed } from '@/widgets/playground-reviews-feed';
import { PlaygroundReviewSummary } from '@/widgets/playground-review-summary';
import { PlaygroundReviewDialog } from '@/widgets/playground-review-dialog';
import { Skeleton } from '@/shared/ui/skeleton';

export type PlaygroundReview = {
    id: string;
    author: {
        name: string;
        avatar: string | null;
    };
    rating: number;
    comment: string;
    timestamp: string;
};

interface PlaygroundReviewsTabProps {
    reviews: PlaygroundReview[];
    onAddReview: (reviewData: Omit<PlaygroundReview, 'id' | 'author' | 'timestamp'>) => void;
    playgroundName: string;
    isLoading: boolean;
}

export function PlaygroundReviewsTab({ reviews, onAddReview, playgroundName, isLoading }: PlaygroundReviewsTabProps) {
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        );
    }
    
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
