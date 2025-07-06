
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { Team } from '@/entities/team/model/types';
import type { FullUserProfile } from '@/entities/user/model/types';
import type { Achievement } from '@/entities/achievement/model/types';

const FanProfile = dynamic(() => import('@/entities/user/ui/fan-profile').then(mod => mod.FanProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type FanClientProps = {
  user: FullUserProfile;
  achievements: Achievement[];
  favoriteTeams: Team[];
  isCurrentUser: boolean;
};

export default function FanClient({ user, achievements, favoriteTeams, isCurrentUser }: FanClientProps) {
  return <FanProfile user={user} achievements={achievements} favoriteTeams={favoriteTeams} isCurrentUser={isCurrentUser} />;
}
