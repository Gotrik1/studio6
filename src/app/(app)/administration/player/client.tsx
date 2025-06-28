'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/types';

const PlayerProfile = dynamic(() => import('@/components/player-profile').then(mod => mod.PlayerProfile), {
    loading: () => <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
    </div>,
    ssr: false,
});

type PlayerProfileProps = {
  user: User & {
    location: string;
    mainSport: string;
    status: string;
    isVerified: boolean;
  };
  isCurrentUser: boolean;
};

export default function PlayerClient({ user, isCurrentUser }: PlayerProfileProps) {
    return <PlayerProfile user={user} isCurrentUser={isCurrentUser} />;
}
