'use client';

import { useState } from 'react';
import { PlaygroundReviewsFeed } from '@/widgets/playground-reviews-feed';
import { PlaygroundReviewSummary } from '@/widgets/playground-review-summary';
import { PlaygroundReviewDialog } from '@/widgets/playground-review-dialog';
import { Skeleton } from '@/shared/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/shared/ui/card';
import type { PlaygroundReview } from '@/entities/playground/model/types';
import type { CreateReviewData } from '@/entities/playground/api/reviews';


interface PlaygroundReviewsTabProps {
    playgroundId: string;
    playgroundName: string;
    reviews: PlaygroundReview[];
    onAddReview: (reviewData: CreateReviewData) => Promise<void>;
    isLoading: boolean;
}

export function PlaygroundReviewsTab({ playgroundId, playgroundName, reviews, onAddReview, isLoading }: PlaygroundReviewsTabProps) {
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {isLoading ? (
                         <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </CardContent>
                        </Card>
                    ) : (
                        <PlaygroundReviewsFeed reviews={reviews} onAddReviewClick={() => setIsReviewDialogOpen(true)} />
                    )}
                </div>
                <div className="lg:col-span-1">
                    <PlaygroundReviewSummary playgroundId={playgroundId} />
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
