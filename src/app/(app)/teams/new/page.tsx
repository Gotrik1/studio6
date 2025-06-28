
'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';

const NewTeamPage = dynamic(
  () => import('@/pages/team-create').then((mod) => mod.NewTeamPage),
  {
    loading: () => <div className="space-y-6"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>,
    ssr: false,
  }
);

export default NewTeamPage;
