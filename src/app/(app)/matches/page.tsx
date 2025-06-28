
'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';

const MatchesPage = dynamic(
  () => import('@/pages/matches-list').then((mod) => mod.MatchesListPage),
  {
    loading: () => <Skeleton className="h-[60vh] w-full" />,
    ssr: false,
  }
);

export default MatchesPage;
