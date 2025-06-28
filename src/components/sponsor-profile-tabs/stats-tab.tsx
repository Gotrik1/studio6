'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SponsorStatsTab() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Проведено кампаний</CardDescription>
                <CardTitle className="font-headline text-4xl">18</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Охваченная аудитория</CardDescription>
                <CardTitle className="font-headline text-4xl">2.5M</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Спонсировано команд</CardDescription>
                <CardTitle className="font-headline text-4xl">7</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Общие инвестиции</CardDescription>
                <CardTitle className="font-headline text-4xl">$75k</CardTitle>
              </CardHeader>
            </Card>
        </div>
    );
}
