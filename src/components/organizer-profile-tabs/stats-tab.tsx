'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function OrganizerStatsTab() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Проведено турниров</CardDescription>
                <CardTitle className="font-headline text-4xl">28</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Всего участников</CardDescription>
                <CardTitle className="font-headline text-4xl">1,500+</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Общий призовой фонд</CardDescription>
                <CardTitle className="font-headline text-4xl">$125k</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Средний рейтинг событий</CardDescription>
                <CardTitle className="font-headline text-4xl">4.8/5</CardTitle>
              </CardHeader>
            </Card>
        </div>
    );
}
