
'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function CoachStatsTab() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Процент побед команды</CardDescription>
                <CardTitle className="font-headline text-4xl">68%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Игроков обучено</CardDescription>
                <CardTitle className="font-headline text-4xl">25</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Выиграно турниров</CardDescription>
                <CardTitle className="font-headline text-4xl">3</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Средний рост игрока</CardDescription>
                <CardTitle className="font-headline text-4xl">+250 ELO</CardTitle>
              </CardHeader>
            </Card>
        </div>
    );
}
