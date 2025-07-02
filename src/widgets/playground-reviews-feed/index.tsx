
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import type { PlaygroundReview } from '@/shared/lib/mock-data/playground-reviews';
import { Star } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

interface PlaygroundReviewsFeedProps {
    reviews: PlaygroundReview[];
    onAddReviewClick: () => void;
}

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} className={cn("h-4 w-4", rating >= star ? "text-amber-400 fill-amber-400" : "text-muted-foreground")} />
        ))}
    </div>
);


export function PlaygroundReviewsFeed({ reviews, onAddReviewClick }: PlaygroundReviewsFeedProps) {
    if (!reviews || reviews.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Отзывы игроков</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-32 flex-col items-center justify-center text-muted-foreground text-center">
                        <p>Для этой площадки еще нет отзывов.</p>
                        <Button variant="link" onClick={onAddReviewClick}>Станьте первым!</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }
    return (
         <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Отзывы игроков</CardTitle>
                        <CardDescription>Мнения тех, кто уже здесь играл.</CardDescription>
                    </div>
                    <Button onClick={onAddReviewClick}>Оставить отзыв</Button>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96 pr-4">
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review.id} className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={review.author.avatar} />
                                    <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm">{review.author.name}</p>
                                        <p className="text-xs text-muted-foreground">{review.timestamp}</p>
                                    </div>
                                    <StarRating rating={review.rating} />
                                    <p className="text-sm text-muted-foreground pt-1">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
