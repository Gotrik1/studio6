
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { generateSponsorshipPitch, type GenerateSponsorshipPitchOutput } from '@/shared/api/genkit/flows/generate-sponsorship-pitch';
import { Loader2, Send, FileText } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Separator } from '@/shared/ui/separator';

const mockTeamInfo = {
    teamName: "Кибер Орлы",
    achievements: "Топ-1 команда платформы, победители Summer Kickoff 2024.",
    goals: "Ищем партнеров для выхода на международную арену, финансирование поездок на LAN-турниры, брендированная форма.",
    audience: "50,000+ подписчиков в социальных сетях, средний возраст аудитории 16-24.",
};

export function SponsorshipPitchGenerator() {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateSponsorshipPitchOutput | null>(null);

    const handleGeneratePitch = async () => {
        setIsGenerating(true);
        setError(null);
        setResult(null);
        try {
            const pitchResult = await generateSponsorshipPitch(mockTeamInfo);
            setResult(pitchResult);
        } catch (e) {
             console.error("Pitch generation failed:", e);
             setError("Не удалось сгенерировать питч.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSendPitch = () => {
        toast({
            title: "Предложение отправлено!",
            description: "Ваш спонсорский питч был отправлен выбранным спонсорам.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI-генератор питчей</CardTitle>
                <CardDescription>Создайте профессиональное спонсорское предложение для вашей команды в один клик на основе данных вашего профиля.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Button onClick={handleGeneratePitch} disabled={isGenerating} className="w-full">
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText className="mr-2 h-4 w-4"/>}
                    Сгенерировать питч для команды &quot;{mockTeamInfo.teamName}&quot;
                </Button>
                
                {isGenerating && <Skeleton className="h-48 w-full" />}
                {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                
                {result && (
                    <div className="space-y-4 animate-in fade-in-50">
                        <Separator />
                        <Label>Сгенерированное предложение:</Label>
                        <Textarea value={result.pitch} readOnly className="h-64 bg-muted"/>
                    </div>
                )}
            </CardContent>
            {result && (
                <CardFooter>
                     <Button onClick={handleSendPitch} className="w-full">
                        <Send className="mr-2 h-4 w-4"/>Отправить спонсорам
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
