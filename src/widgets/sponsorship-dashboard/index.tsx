'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { sponsorshipScout, type SponsorshipScoutOutput } from '@/shared/api/genkit/flows/sponsorship-scout-flow';
import { generateSponsorshipPitch, type GenerateSponsorshipPitchOutput } from '@/shared/api/genkit/flows/generate-sponsorship-pitch';
import { Loader2, Sparkles, Send, FileText } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/shared/ui/separator';

const mockTeamInfo = {
    name: "Кибер Орлы",
    achievements: "Топ-1 команда платформы, победители Summer Kickoff 2024.",
    goals: "Ищем партнеров для выхода на международную арену, финансирование поездок на LAN-турниры, брендированная форма.",
    audience: "50,000+ подписчиков в социальных сетях, средний возраст аудитории 16-24.",
};

export function SponsorshipDashboard() {
    const { toast } = useToast();
    
    // AI Scout states
    const [scoutPrompt, setScoutPrompt] = useState('Хочу прорекламировать свой бренд энергетических напитков среди молодой аудитории, которая увлекается Valorant.');
    const [isScouting, setIsScouting] = useState(false);
    const [scoutError, setScoutError] = useState<string | null>(null);
    const [scoutResult, setScoutResult] = useState<SponsorshipScoutOutput | null>(null);

    // AI Pitch Generator states
    const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
    const [pitchError, setPitchError] = useState<string | null>(null);
    const [pitchResult, setPitchResult] = useState<GenerateSponsorshipPitchOutput | null>(null);
    
    const handleScout = async () => {
        setIsScouting(true);
        setScoutError(null);
        setScoutResult(null);
        try {
            const result = await sponsorshipScout(scoutPrompt);
            setScoutResult(result);
        } catch (e) {
            console.error("Scouting failed:", e);
            setScoutError("Не удалось найти команды. Попробуйте изменить запрос.");
        } finally {
            setIsScouting(false);
        }
    };
    
    const handleGeneratePitch = async () => {
        setIsGeneratingPitch(true);
        setPitchError(null);
        setPitchResult(null);
        try {
            const result = await generateSponsorshipPitch(mockTeamInfo);
            setPitchResult(result);
        } catch (e) {
             console.error("Pitch generation failed:", e);
             setPitchError("Не удалось сгенерировать питч.");
        } finally {
            setIsGeneratingPitch(false);
        }
    };
    
    const handleSendPitch = () => {
        toast({
            title: "Предложение отправлено!",
            description: "Ваш спонсорский питч был отправлен выбранным спонсорам.",
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>AI-скаут талантов</CardTitle>
                        <CardDescription>Опишите ваши маркетинговые цели, и AI подберет наиболее подходящие команды для спонсорства.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="Например: 'Ищем команду по CS:GO 2 с активной аудиторией в Москве для рекламы нашего бренда периферии.'"
                            value={scoutPrompt}
                            onChange={(e) => setScoutPrompt(e.target.value)}
                            disabled={isScouting}
                            className="min-h-[100px]"
                        />
                        <Button onClick={handleScout} disabled={isScouting} className="w-full">
                            {isScouting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                            Найти команды
                        </Button>
                    </CardContent>
                </Card>

                {isScouting && <Skeleton className="h-64 w-full" />}
                {scoutError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{scoutError}</AlertDescription></Alert>}
                {scoutResult && (
                    <Card className="animate-in fade-in-50">
                        <CardHeader>
                            <CardTitle>Рекомендованные команды</CardTitle>
                             <CardDescription>{scoutResult.reasoning}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {scoutResult.recommendations.map(team => (
                                <Card key={team.slug} className="p-4">
                                     <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <Image src={team.logo} alt={team.name} width={56} height={56} className="rounded-full border" data-ai-hint={team.logoHint} />
                                            <div>
                                                <Link href={`/teams/${team.slug}`} className="font-bold hover:underline">{team.name}</Link>
                                                <p className="text-sm text-muted-foreground">{team.game}</p>
                                            </div>
                                        </div>
                                        <Button size="sm"><Send className="mr-2 h-4 w-4"/>Предложить</Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 italic pl-2 border-l-2">
                                        &quot;{team.pitch}&quot;
                                    </p>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>AI-генератор питчей</CardTitle>
                    <CardDescription>Создайте профессиональное спонсорское предложение для вашей команды в один клик.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button onClick={handleGeneratePitch} disabled={isGeneratingPitch} className="w-full">
                        {isGeneratingPitch ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText className="mr-2 h-4 w-4"/>}
                        Сгенерировать питч
                    </Button>
                    
                    {isGeneratingPitch && <Skeleton className="h-48 w-full" />}
                    {pitchError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{pitchError}</AlertDescription></Alert>}
                    
                    {pitchResult && (
                        <div className="space-y-4 animate-in fade-in-50">
                            <Separator />
                            <Label>Сгенерированное предложение:</Label>
                            <Textarea value={pitchResult.pitch} readOnly className="h-64 bg-muted"/>
                        </div>
                    )}
                </CardContent>
                {pitchResult && (
                    <CardFooter>
                         <Button onClick={handleSendPitch} className="w-full">
                            <Send className="mr-2 h-4 w-4"/>Отправить спонсорам
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
