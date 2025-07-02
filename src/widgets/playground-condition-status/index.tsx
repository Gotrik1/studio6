
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { ShieldAlert, ShieldCheck, Wrench, ShieldQuestion } from 'lucide-react';
import type { AnalyzePlaygroundReportOutput } from '@/shared/api/genkit/flows/analyze-playground-report-schema';

interface PlaygroundConditionStatusProps {
    status: 'ok' | 'issue';
    report?: AnalyzePlaygroundReportOutput;
}

const getSeverityIcon = (severity?: 'low' | 'medium' | 'high') => {
    switch (severity) {
        case 'high':
            return <ShieldAlert className="h-4 w-4 text-destructive" />;
        case 'medium':
            return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
        case 'low':
            return <ShieldCheck className="h-4 w-4 text-blue-500" />;
        default:
            return <ShieldQuestion className="h-4 w-4" />;
    }
}

export function PlaygroundConditionStatus({ status, report }: PlaygroundConditionStatusProps) {
    if (status === 'ok') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        Состояние площадки
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert className="border-green-500/50">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <AlertTitle>Все в порядке</AlertTitle>
                        <AlertDescription>
                            Нет активных сообщений о проблемах на этой площадке. Приятной игры!
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }
    
    if (status === 'issue' && report) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        Состояние площадки
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant={report.severity === 'high' ? 'destructive' : 'default'} className={report.severity === 'medium' ? 'border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500' : ''}>
                        {getSeverityIcon(report.severity)}
                        <AlertTitle>Внимание: {report.summary}</AlertTitle>
                        <AlertDescription>
                           Последнее сообщение от игроков. Рекомендуем быть осторожнее.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return null;
}
