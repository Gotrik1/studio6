'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { FullUserProfile, PlayerProfileData } from '@/entities/user/api/get-user';
import type { achievements as AchievementsArray } from "@/shared/lib/mock-data/profiles";

const JudgeProfile = dynamic(() => import('@/entities/user/ui/judge-profile').then(mod => mod.JudgeProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type JudgeProfileProps = {
  user: FullUserProfile;
  achievements: typeof AchievementsArray;
};

export default function JudgeClient({ user, achievements }: JudgeProfileProps) {
  return <JudgeProfile user={user} achievements={achievements} />;
}
