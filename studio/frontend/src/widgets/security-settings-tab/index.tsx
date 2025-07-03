
'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Loader2, Sparkles, AlertCircle, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { analyzeSecurity, type AnalyzeSecurityOutput } from '@/shared/api/genkit/flows/analyze-security-flow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';

const mockActivityLog = `
- Login from new location: Omsk, Russia (IP: 123.45.67.89) at 03:15 AM
- 5 consecutive losses in ranked Valorant matches with unusually low KDA (0.2).
- Chat message sent: "hey check out this cool site for free skins [phishing-link].com"
- 3 failed login attempts before successful login.
`;

const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
        case 'high':
            return <ShieldAlert className="h-4 w-4 text-destructive" />;
        case 'medium':
            return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
        case 'low':
            return <ShieldCheck className="h-4 w-4 text-green-500" />;
        default:
            return <Shield className="h-4 w-4" />;
    }
}

export function SecuritySettingsTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeSecurityOutput | null>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const analysisResult = await analyzeSecurity({ activityLog: mockActivityLog });
            setResult(analysisResult);
        } catch (e) {
            console.error(e);
            setError('Не удалось выполнить анализ безопасности. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Анализ безопасности аккаунта</CardTitle>
                <CardDescription>
                    Запустите проверку, чтобы AI проанализировал вашу недавнюю активность на предмет подозрительных действий и дал рекомендации по защите аккаунта.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Проверить мой аккаунт
                </Button>

                {isLoading && <Skeleton className="h-32 w-full" />}
                
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {result && (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Результаты анализа:</h3>
                        {result.recommendations.length === 0 ? (
                             <Alert variant="default" className="border-green-500/50">
                                <ShieldCheck className="h-4 w-4 text-green-500" />
                                <AlertTitle>Все в порядке!</AlertTitle>
                                <AlertDescription>Никаких подозрительных действий не обнаружено. Ваш аккаунт в безопасности.</AlertDescription>
                            </Alert>
                        ) : (
                            result.recommendations.map((rec, index) => (
                                <Alert key={index} variant={rec.severity === 'high' ? 'destructive' : 'default'}>
                                    {getSeverityIcon(rec.severity)}
                                    <AlertTitle>{rec.title}</AlertTitle>
                                    <AlertDescription>{rec.description}</AlertDescription>
                                </Alert>
                            ))
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
