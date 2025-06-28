'use client';
import dynamic from 'next/dynamic';
import { useSession } from "@/lib/session-client";
import { Skeleton } from '@/components/ui/skeleton';

const SettingsPageComponent = dynamic(
  () => import('@/pages/settings').then((mod) => mod.SettingsPage),
  {
    loading: () => <div className="space-y-6"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>,
    ssr: false,
  }
);

// We still need the server component to fetch session data
export default function SettingsPage() {
  const { user } = useSession();

  // In a real app, user settings would also be fetched.
  // We augment the session user with mock settings data.
  const userWithSettings = user ? {
    ...user,
    location: "Москва",
    mainSport: "Valorant",
  } : null;

  return <SettingsPageComponent user={userWithSettings} />;
}
