'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsTab() {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
                <CardHeader>
                <CardDescription>Матчи</CardDescription>
                <CardTitle className="font-headline text-4xl">218</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                <CardDescription>Победы</CardDescription>
                <CardTitle className="font-headline text-4xl">152</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                <CardDescription>Поражения</CardDescription>
                <CardTitle className="font-headline text-4xl">61</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                <CardDescription>Голы</CardDescription>
                <CardTitle className="font-headline text-4xl">88</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}
