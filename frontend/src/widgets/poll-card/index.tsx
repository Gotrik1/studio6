

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Label } from '@/shared/ui/label';
import { useToast } from '@/shared/hooks/use-toast';
import { Badge } from '@/shared/ui/badge';
import type { Poll } from '@/entities/poll/model/types';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

interface PollCardProps {
    poll: Poll | null;
    onVote: (pollId: string, optionId: string) => Promise<boolean>;
    isVotedInitially?: boolean;
}

export function PollCard({ poll, onVote, isVotedInitially = false }: PollCardProps) {
    const { toast } = useToast();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isVoted, setIsVoted] = useState(isVotedInitially);
    const [isLoading, setIsLoading] = useState(false);

    const handleVote = async () => {
        if (!selectedOption || !poll) {
            toast({
                variant: 'destructive',
                title: "Ошибка",
                description: "Пожалуйста, выберите вариант перед голосованием.",
            });
            return;
        }
        setIsLoading(true);
        const success = await onVote(poll.id, selectedOption);
        if (success) {
            setIsVoted(true);
        }
        setIsLoading(false);
    };

    if (!poll) {
        return (
            <Card>
                <CardHeader><CardTitle>Опрос</CardTitle></CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    Активных опросов нет.
                </CardContent>
            </Card>
        );
    }
    
    const totalVotes = poll.totalVotes;
    const author = poll.author;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{poll.title}</CardTitle>
                        <CardDescription>{poll.question}</CardDescription>
                    </div>
                    {author && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0 ml-4">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={author.avatar || ''} />
                                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="hidden sm:inline">{author.name}</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedOption || undefined}
                    onValueChange={setSelectedOption}
                    className="space-y-2"
                    disabled={isVoted || isLoading}
                >
                    {poll.options.map((option) => {
                        const percentage = isVoted && totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                        return (
                            <div key={option.id}>
                                <div className="relative flex items-center space-x-2 rounded-md border p-3">
                                    {isVoted && (
                                        <div 
                                            className="absolute left-0 top-0 h-full rounded-l-md bg-primary/20 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    )}
                                    <RadioGroupItem value={option.id} id={option.id} className="z-10" />
                                    <Label htmlFor={option.id} className="flex-1 cursor-pointer z-10">{option.text}</Label>
                                    {isVoted && <Badge variant="secondary" className="z-10">{percentage.toFixed(1)}%</Badge>}
                                </div>
                            </div>
                        );
                    })}
                </RadioGroup>
            </CardContent>
            <CardFooter>
                <Button onClick={handleVote} disabled={!selectedOption || isVoted || isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {isVoted ? "Вы проголосовали" : isLoading ? "Голосование..." : "Голосовать"}
                </Button>
            </CardFooter>
        </Card>
    );
}
