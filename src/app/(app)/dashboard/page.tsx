
'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';

const DashboardPage = dynamic(
  () => import('@/pages/dashboard').then((mod) => mod.DashboardPage),
  {
    loading: () => (
       <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </aside>
      </div>
    ),
    ssr: false,
  }
);

export default DashboardPage;
