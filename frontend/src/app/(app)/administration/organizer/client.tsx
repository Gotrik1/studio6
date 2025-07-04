'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { organizerUser, organizerAchievements } from "@/shared/lib/mock-data/organizer-profile";
import type { TournamentCrm } from '@/shared/lib/mock-data/crm-tournaments';

const OrganizerProfile = dynamic(() => import('@/entities/user/ui/organizer-profile').then(mod => mod.OrganizerProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type OrganizerProfileProps = {
  user: typeof organizerUser;
  achievements: typeof organizerAchievements;
  tournaments: TournamentCrm[];
};

export default function OrganizerClient({ user, achievements, tournaments }: OrganizerProfileProps) {
  return <OrganizerProfile user={user} achievements={achievements} tournaments={tournaments} />;
}
