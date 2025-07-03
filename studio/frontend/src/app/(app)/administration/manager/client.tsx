'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { managerUser, managerAchievements } from "@/shared/lib/mock-data/manager-profile";

const ManagerProfile = dynamic(() => import('@/entities/user/ui/manager-profile').then(mod => mod.ManagerProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type ManagerProfileProps = {
  user: typeof managerUser;
  achievements: typeof managerAchievements;
};

export default function ManagerClient({ user, achievements }: ManagerProfileProps) {
  return <ManagerProfile user={user} achievements={achievements} />;
}
