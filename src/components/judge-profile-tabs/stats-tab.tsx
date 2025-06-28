'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function JudgeStatsTab() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardDescription>Судейство матчей</CardDescription>
                    <CardTitle className="font-headline text-4xl">217</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Обслужено турниров</CardDescription>
                    <CardTitle className="font-headline text-4xl">15</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Решено споров</CardDescription>
                    <CardTitle className="font-headline text-4xl">8</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Рейтинг от игроков</CardDescription>
                    <CardTitle className="font-headline text-4xl">4.9/5.0</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}
