
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { findSponsorsForTeam, type FindSponsorsForTeamOutput } from '@/shared/api/genkit/flows/find-sponsors-for-team-flow';
import { Textarea } from '@/shared/ui/textarea';
import { Loader2, Sparkles, Send, Building } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/shared/ui/skeleton';

const mockTeamInfo = {
    teamName: "Кибер Орлы",
    teamGame: "Valorant",
};

export function TeamSponsorScout() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('Мы - топ-1 команда платформы, ищем партнеров для участия в городских лигах. Нам нужно финансирование поездок и брендированная форма.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FindSponsorsForTeamOutput | null>(null);

    const handleSearch = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const scoutResult = await findSponsorsForTeam({
                ...mockTeamInfo,
                teamDescription: prompt,
            });
            setResult(scoutResult);
            if (scoutResult.recommendations.length === 0) {
                 toast({
                    title: "Ничего не найдено",
                    description: "Попробуйте изменить ваш запрос.",
                });
            }
        } catch (e) {
            console.error(e);
            setError('Не удалось найти спонсоров. Попробуйте изменить ваш запрос.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleContact = (sponsorName: string) => {
        toast({
            title: "Заявка отправлена!",
            description: `Ваш запрос на спонсорство отправлен компании ${sponsorName}.`
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building /> AI-Поиск Спонсоров</CardTitle>
                    <CardDescription>Опишите свою команду, достижения и потребности, и наш AI подберет наиболее подходящих спонсоров.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Например: 'Мы - молодая и перспективная команда по Dota 2. Ищем спонсора для покупки формы и оплаты взносов на турниры...'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[100px]"
                    />
                     {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                     <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {isLoading ? 'Идет поиск...' : 'Найти спонсоров'}
                    </Button>
                </CardFooter>
            </Card>

            <div className="space-y-4">
                {isLoading && Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full" />
                ))}
                
                {result && result.recommendations.length > 0 && (
                     <div className="space-y-6 animate-in fade-in-50">
                        {result.recommendations.map(({sponsor, reasoning}) => (
                            <Card key={sponsor.id}>
                                <CardHeader className="flex-row gap-4 justify-between items-start">
                                <div className="flex gap-4">
                                    <Image src={sponsor.logo} alt={sponsor.name} width={56} height={56} className="rounded-lg border" data-ai-hint={sponsor.logoHint} />
                                    <div>
                                        <CardTitle className="text-lg hover:underline"><Link href={sponsor.profileUrl}>{sponsor.name}</Link></CardTitle>
                                        <CardDescription>{sponsor.description}</CardDescription>
                                    </div>
                                </div>
                                <Button onClick={() => handleContact(sponsor.name)} size="sm">
                                    <Send className="mr-2 h-4 w-4" />
                                    Отправить питч
                                </Button>
                                </CardHeader>
                                <CardContent>
                                    <Alert>
                                        <Sparkles className="h-4 w-4" />
                                        <AlertTitle>Почему это хороший кандидат?</AlertTitle>
                                        <AlertDescription>{reasoning}</AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
             {!isLoading && result && result.recommendations.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                    <p>Подходящих спонсоров не найдено. Попробуйте уточнить ваш запрос.</p>
                </div>
            )}
        </div>
    );
}
