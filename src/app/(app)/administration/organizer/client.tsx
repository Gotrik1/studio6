'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { organizerUser, organizerAchievements } from "@/shared/lib/mock-data/organizer-profile";

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
};

export default function OrganizerClient({ user, achievements }: OrganizerProfileProps) {
  return <OrganizerProfile user={user} achievements={achievements} />;
}
