'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { judgeUser, judgeAchievements } from "@/lib/mock-data/judge-profile";

const JudgeProfile = dynamic(() => import('@/components/judge-profile').then(mod => mod.JudgeProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type JudgeProfileProps = {
  user: typeof judgeUser;
  achievements: typeof judgeAchievements;
};

export default function JudgeClient({ user, achievements }: JudgeProfileProps) {
  return <JudgeProfile user={user} achievements={achievements} />;
}
