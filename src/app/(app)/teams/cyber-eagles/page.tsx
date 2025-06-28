
'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';

const TeamDetailsPage = dynamic(
  () => import('@/pages/team-details').then((mod) => mod.TeamDetailsPage),
  {
    loading: () => <div className="space-y-6"><Skeleton className="h-64 w-full" /><Skeleton className="h-96 w-full" /></div>,
    ssr: false,
  }
);

export default TeamDetailsPage;
