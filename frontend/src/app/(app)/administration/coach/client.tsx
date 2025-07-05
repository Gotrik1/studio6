'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { FullUserProfile } from '@/entities/user/model/types';
import type { Achievement } from '@/entities/achievement/model/types';
import type { CoachedPlayer } from '@/entities/user/model/types';

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
  achievements: Achievement[];
  players: CoachedPlayer[];
};

export default function CoachClient({ user, achievements, players }: CoachClientProps) {
  return <CoachProfile user={user} achievements={achievements} players={players} />;
}
