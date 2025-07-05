
'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { useToast } from '@/shared/hooks/use-toast';
import { Loader2, Star, Send } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { CreateReviewData } from '@/entities/playground/api/reviews';

interface PlaygroundReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddReview: (review: CreateReviewData) => Promise<void>;
  playgroundName: string;
}

export function PlaygroundReviewDialog({ isOpen, onOpenChange, onAddReview, playgroundName }: PlaygroundReviewDialogProps) {
    const { toast } = useToast();
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setComment('');
            setRating(0);
            setHoverRating(0);
        }
        onOpenChange(open);
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Пожалуйста, поставьте оценку.' });
            return;
        }
        if (!comment.trim()) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Пожалуйста, напишите отзыв.' });
            return;
        }
        
        setIsSubmitting(true);
        await onAddReview({ rating, comment });
        setIsSubmitting(false);
        handleOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Оставить отзыв о &quot;{playgroundName}&quot;</DialogTitle>
                    <DialogDescription>
                       Поделитесь своим мнением о площадке. Это поможет другим игрокам.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Ваша оценка</Label>
                        <div className="flex gap-1">
                             {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn("h-8 w-8 cursor-pointer transition-colors", (hoverRating || rating) >= star ? "text-amber-400 fill-amber-400" : "text-muted-foreground")}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="review-comment">Ваш отзыв</Label>
                        <Textarea id="review-comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="Что вам понравилось, а что нет?" className="min-h-[100px]"/>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                        Отправить отзыв
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
