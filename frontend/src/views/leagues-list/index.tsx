'use client';

import { Card, CardContent, CardTitle } from '@/shared/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/shared/ui/badge';
import { Users, Gamepad2 } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { useState } from 'react';
import type { League } from '@/entities/league/model/types';


interface LeaguesListPageProps {
  initialLeagues: League[];
}

export function LeaguesListPage({ initialLeagues }: LeaguesListPageProps) {
  const [leagues] = useState(initialLeagues);
  const [isLoading] = useState(false); // Can be set to true if fetching client-side

  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Лиги ProDvor</h1>
        <p className="text-muted-foreground">
          Участвуйте в сезонных лигах, сражайтесь за верхние строчки в таблице и докажите, что ваша команда — лучшая.
        </p>
      </div>
      <div className="space-y-6">
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : leagues.length > 0 ? (
          leagues.map((league) => (
          <Link key={league.id} href={`/leagues/${league.id}`} className="block">
            <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary">
              <div className="relative h-48 w-full">
                <Image src={league.image} alt={league.name} fill className="object-cover" data-ai-hint={league.imageHint} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <CardTitle className="absolute bottom-4 left-4 text-white font-headline text-2xl shadow-lg">{league.name}</CardTitle>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">{league.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary" className="flex items-center gap-1.5"><Gamepad2 className="h-4 w-4" />{league.game}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1.5"><Users className="h-4 w-4" />{league.teams.length} команд</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
        ) : (
          <Card className="text-center p-12">
            <p className="text-muted-foreground">На данный момент активных лиг нет.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
