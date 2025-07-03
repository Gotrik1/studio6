'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { fanUser, fanAchievements } from "@/shared/lib/mock-data/fan-profile";
import type { Team } from '@/entities/team/model/types';

const FanProfile = dynamic(() => import('@/entities/user/ui/fan-profile').then(mod => mod.FanProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type FanClientProps = {
  user: typeof fanUser;
  achievements: typeof fanAchievements;
  favoriteTeams: Team[];
  isCurrentUser: boolean;
};

export default function FanClient({ user, achievements, favoriteTeams, isCurrentUser }: FanClientProps) {
  return <FanProfile user={user} achievements={achievements} favoriteTeams={favoriteTeams} isCurrentUser={isCurrentUser} />;
}
