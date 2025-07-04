'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { sponsorUser, sponsorAchievements } from "@/shared/lib/mock-data/sponsor-profile";

const SponsorProfile = dynamic(() => import('@/entities/user/ui/sponsor-profile').then(mod => mod.SponsorProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type SponsorProfileProps = {
  user: typeof sponsorUser;
  achievements: typeof sponsorAchievements;
};

export default function SponsorClient({ user, achievements }: SponsorProfileProps) {
  return <SponsorProfile user={user} achievements={achievements} />;
}
