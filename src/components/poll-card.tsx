'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

type PollOption = {
    id: string;
    text: string;
    votes: number;
};

interface PollCardProps {
    poll: {
        id: string;
        title: string;
        question: string;
        options: PollOption[];
        totalVotes: number;
    };
}

export function PollCard({ poll }: PollCardProps) {
    const { toast } = useToast();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [voted, setVoted] = useState(false);

    const handleVote = () => {
        if (!selectedOption) {
            toast({
                variant: 'destructive',
                title: "Ошибка",
                description: "Пожалуйста, выберите вариант перед голосованием.",
            });
            return;
        }
        setVoted(true);
        toast({
            title: "Голос учтён!",
            description: "Спасибо за участие в опросе.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.question}</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedOption || undefined}
                    onValueChange={setSelectedOption}
                    className="space-y-2"
                    disabled={voted}
                >
                    {poll.options.map((option) => {
                        const percentage = voted ? (option.votes / poll.totalVotes) * 100 : 0;
                        return (
                            <div key={option.id}>
                                <div className="relative flex items-center space-x-2 rounded-md border p-3">
                                    {voted && (
                                        <div 
                                            className="absolute left-0 top-0 h-full rounded-l-md bg-primary/20 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    )}
                                    <RadioGroupItem value={option.id} id={option.id} className="z-10" />
                                    <Label htmlFor={option.id} className="flex-1 cursor-pointer z-10">{option.text}</Label>
                                    {voted && <Badge variant="secondary" className="z-10">{percentage.toFixed(1)}%</Badge>}
                                </div>
                            </div>
                        );
                    })}
                </RadioGroup>
            </CardContent>
            <CardFooter>
                <Button onClick={handleVote} disabled={!selectedOption || voted} className="w-full">
                    {voted ? "Вы проголосовали" : "Голосовать"}
                </Button>
            </CardFooter>
        </Card>
    );
}
