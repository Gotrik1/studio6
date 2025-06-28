
'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';

const TeamsPage = dynamic(
  () => import('@/pages/teams-list').then((mod) => mod.TeamsListPage),
  {
    loading: () => <Skeleton className="h-[60vh] w-full" />,
    ssr: false,
  }
);

export default TeamsPage;
