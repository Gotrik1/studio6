
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { User } from '@/shared/lib/types';
import type { achievements as AchievementsArray, teams as TeamsArray, recentMatches as MatchesArray, gallery as GalleryArray, careerHistory as CareerHistoryArray, playerActivity as PlayerActivityArray } from "@/shared/lib/mock-data/profiles";

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
  teams: typeof TeamsArray;
  recentMatches: typeof MatchesArray;
  gallery: typeof GalleryArray;
  careerHistory: typeof CareerHistoryArray;
  playerActivity: typeof PlayerActivityArray;
};

export default function PlayerClient({ user, isCurrentUser, achievements, teams, recentMatches, gallery, careerHistory, playerActivity }: PlayerClientProps) {
    return <PlayerProfile 
        user={user} 
        isCurrentUser={isCurrentUser}
        achievements={achievements}
        teams={teams}
        recentMatches={recentMatches}
        gallery={gallery}
        careerHistory={careerHistory}
        playerActivity={playerActivity}
    />;
}
