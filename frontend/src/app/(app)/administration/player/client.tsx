
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { User } from '@/shared/lib/types';
import type { achievements as AchievementsArray } from "@/shared/lib/mock-data/profiles";
import type { PlayerActivityItem } from '@/widgets/player-activity-feed';
import type { UserTeam, CareerHistoryItem, GalleryItem, PlayerStats } from '@/entities/user/model/types';

const PlayerProfile = dynamic(() => import('@/entities/player/ui/player-profile').then(mod => mod.PlayerProfile), {
    loading: () => <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
    </div>,
    ssr: false,
});

type PlayerClientProps = {
  user: User & {
    location: string;
    mainSport: string;
    status: string;
    isVerified: boolean;
    xp: number;
    dateOfBirth: string;
    age: number;
    preferredSports: string[];
    contacts: { telegram: string; discord: string };
  };
  isCurrentUser: boolean;
  achievements: typeof AchievementsArray;
  teams: UserTeam[];
  gallery: GalleryItem[];
  careerHistory: CareerHistoryItem[];
  playerActivity: PlayerActivityItem[];
  stats: PlayerStats | null;
};

export default function PlayerClient({ user, isCurrentUser, achievements, teams, gallery, careerHistory, playerActivity, stats }: PlayerClientProps) {
    return <PlayerProfile 
        user={user} 
        isCurrentUser={isCurrentUser}
        achievements={achievements}
        teams={teams}
        gallery={gallery}
        careerHistory={careerHistory}
        playerActivity={playerActivity}
        stats={stats}
    />;
}
