'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { moderatorUser, moderatorAchievements } from "@/lib/mock-data/moderator-profile";

const ModeratorProfile = dynamic(() => import('@/components/moderator-profile').then(mod => mod.ModeratorProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type ModeratorProfileProps = {
  user: typeof moderatorUser;
  achievements: typeof moderatorAchievements;
};

export default function ModeratorClient({ user, achievements }: ModeratorProfileProps) {
  return <ModeratorProfile user={user} achievements={achievements} />;
}
