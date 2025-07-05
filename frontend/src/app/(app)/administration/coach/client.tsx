'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { FullUserProfile } from '@/entities/user/api/get-user';
import type { achievements as AchievementsArray } from "@/shared/lib/mock-data/profiles";
import type { CoachedPlayer } from '@/widgets/team-training-analytics';

const CoachProfile = dynamic(() => import('@/entities/user/ui/coach-profile').then(mod => mod.CoachProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type CoachClientProps = {
  user: FullUserProfile;
  achievements: typeof AchievementsArray;
  players: CoachedPlayer[];
};

export default function CoachClient({ user, achievements, players }: CoachClientProps) {
  return <CoachProfile user={user as any} achievements={achievements} players={players} />;
}
