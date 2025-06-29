'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';

export function TournamentCrmCreatePage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Создание нового турнира</h1>
                <p className="text-muted-foreground">
                    На этом месте будет находиться мастер создания турниров.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Мастер создания</CardTitle>
                    <CardDescription>В разработке...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">Здесь будет пошаговый процесс создания турнира.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
