'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function ManagerStatsTab() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Управляемых игроков</CardDescription>
                <CardTitle className="font-headline text-4xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Привлечено спонсоров</CardDescription>
                <CardTitle className="font-headline text-4xl">5</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Стоимость команды</CardDescription>
                <CardTitle className="font-headline text-4xl">$250k</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Заключено контрактов</CardDescription>
                <CardTitle className="font-headline text-4xl">21</CardTitle>
              </CardHeader>
            </Card>
        </div>
    );
}
