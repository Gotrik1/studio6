'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboardPage = dynamic(
  () => import('@/pages/admin-dashboard/index').then((mod) => mod.AdminDashboardPage),
  {
    loading: () => (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-96 w-full" />
          <Skeleton className="lg:col-span-1 h-96 w-full" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default AdminDashboardPage;
