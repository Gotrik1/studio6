

'use client';

import { PlaygroundLeaderboard } from '@/widgets/playground-leaderboard';
import { AiPlaygroundChallenge } from '@/widgets/ai-playground-challenge';
import type { Playground } from '@/entities/playground/model/types';


export function PlaygroundLeaderboardTab() {
    // This is a placeholder as the real playground data is not yet fully plumbed.
    const mockPlayground: Playground = {
        id: 'playground-1',
        name: 'Коробка за Пятёрочкой',
        address: 'Москва, ул. Народного Ополчения, 22к2',
        type: 'Футбол',
        coverImage: 'https://placehold.co/2560x720.png',
        coverImageHint: 'street football cage',
        surface: 'Искусственный газон',
        features: ['Ворота', 'Освещение'],
        rating: 4.5,
        checkIns: 128,
        status: 'APPROVED',
        creator: { name: 'Superuser', avatar: 'https://placehold.co/100x100.png' },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlaygroundLeaderboard />
            <AiPlaygroundChallenge playground={mockPlayground} />
        </div>
    );
}
