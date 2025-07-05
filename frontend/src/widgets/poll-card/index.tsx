
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Label } from '@/shared/ui/label';
import { useToast } from '@/shared/hooks/use-toast';
import { Badge } from '@/shared/ui/badge';

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
    const [votes, setVotes] = useState(poll.options.map(opt => opt.votes));
    const [totalVotes, setTotalVotes] = useState(poll.totalVotes);

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
        const selectedIndex = poll.options.findIndex(opt => opt.id === selectedOption);
        if (selectedIndex !== -1) {
            setVotes(currentVotes => {
                const newVotes = [...currentVotes];
                newVotes[selectedIndex]++;
                return newVotes;
            });
            setTotalVotes(current => current + 1);
        }
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
                    {poll.options.map((option, index) => {
                        const percentage = voted ? (votes[index] / totalVotes) * 100 : 0;
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
