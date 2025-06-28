
'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';

const NewMatchPage = dynamic(
  () => import('@/pages/match-create').then((mod) => mod.NewMatchPage),
  {
    loading: () => <div className="space-y-6"><Skeleton className="h-40 w-full" /><Skeleton className="h-64 w-full" /></div>,
    ssr: false,
  }
);

export default NewMatchPage;
