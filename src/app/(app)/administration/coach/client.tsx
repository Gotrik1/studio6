'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { coachUser, coachAchievements } from "@/lib/mock-data/coach-profile";

const CoachProfile = dynamic(() => import('@/components/coach-profile').then(mod => mod.CoachProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type CoachProfileProps = {
  user: typeof coachUser;
  achievements: typeof coachAchievements;
};

export default function CoachClient({ user, achievements }: CoachProfileProps) {
  return <CoachProfile user={user} achievements={achievements} />;
}
