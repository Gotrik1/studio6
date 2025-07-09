"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function FanStatsTab() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Отслеживаемые команды</CardDescription>
          <CardTitle className="font-headline text-4xl">12</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Просмотрено матчей</CardDescription>
          <CardTitle className="font-headline text-4xl">340</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Оставлено комментариев</CardDescription>
          <CardTitle className="font-headline text-4xl">512</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Голосов за игрока матча</CardDescription>
          <CardTitle className="font-headline text-4xl">89</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
