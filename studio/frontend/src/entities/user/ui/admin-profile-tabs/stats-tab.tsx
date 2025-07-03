
'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function AdminStatsTab() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Активные пользователи</CardDescription>
                <CardTitle className="font-headline text-4xl">1,257</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Открытые жалобы</CardDescription>
                <CardTitle className="font-headline text-4xl">14</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Время работы сервера</CardDescription>
                <CardTitle className="font-headline text-4xl">99.98%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Доход (месяц)</CardDescription>
                <CardTitle className="font-headline text-4xl">$5,230</CardTitle>
              </CardHeader>
            </Card>
        </div>
    );
}
