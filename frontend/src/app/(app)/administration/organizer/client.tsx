'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { FullUserProfile } from '@/entities/user/api/get-user';
import type { TournamentCrm } from '@/entities/user/model/types';
import type { achievements as AchievementsArray } from "@/shared/lib/mock-data/profiles";


const OrganizerProfile = dynamic(() => import('@/entities/user/ui/organizer-profile').then(mod => mod.OrganizerProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type OrganizerProfileProps = {
  user: FullUserProfile;
  achievements: typeof AchievementsArray;
  tournaments: TournamentCrm[];
};

export default function OrganizerClient({ user, achievements, tournaments }: OrganizerProfileProps) {
  return <OrganizerProfile user={user as any} achievements={achievements} tournaments={tournaments} />;
}
