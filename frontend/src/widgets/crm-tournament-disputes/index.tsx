
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Gavel } from 'lucide-react';

export function CrmTournamentDisputes() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gavel /> Спорные матчи</CardTitle>
                <CardDescription>Разрешение споров в рамках турнира.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">В этом турнире нет активных споров.</p>
                </div>
            </CardContent>
        </Card>
    );
}
