
'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function ModeratorStatsTab() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Решено жалоб (24ч)</CardDescription>
                <CardTitle className="font-headline text-4xl">38</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Предупреждено</CardDescription>
                <CardTitle className="font-headline text-4xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Забанено (7д)</CardDescription>
                <CardTitle className="font-headline text-4xl">4</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Точность</CardDescription>
                <CardTitle className="font-headline text-4xl">98.5%</CardTitle>
              </CardHeader>
            </Card>
        </div>
    );
}
