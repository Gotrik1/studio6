
'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';

const TournamentsPage = dynamic(
  () => import('@/pages/tournaments-list').then((mod) => mod.TournamentsListPage),
  {
    loading: () => <Skeleton className="h-[60vh] w-full" />,
    ssr: false,
  }
);

export default TournamentsPage;
