
'use client';

import { PlayerScout } from '@/widgets/player-scout';
import { UserCheck } from 'lucide-react';

export function PlayerScoutPage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2 text-center">
                 <UserCheck className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Скаут Игроков</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Опишите идеального кандидата для вашей команды, и наш AI-скаут найдет лучших игроков на платформе.
                </p>
            </div>
            <PlayerScout />
        </div>
    );
}
