'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { adminUser, adminAchievements } from "@/shared/lib/mock-data/admin-profile";

const AdminProfile = dynamic(() => import('@/entities/user/ui/admin-profile').then(mod => mod.AdminProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type AdminProfileProps = {
  user: typeof adminUser;
  achievements: typeof adminAchievements;
};

export default function AdministratorClient({ user, achievements }: AdminProfileProps) {
  return <AdminProfile user={user} achievements={achievements} />;
}
