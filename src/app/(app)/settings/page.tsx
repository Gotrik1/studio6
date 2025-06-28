
'use client';
import dynamic from 'next/dynamic';
import { getSession } from "@/shared/lib/session";
import type { User } from "@/shared/lib/types";
import SettingsClient from "./client";
import { Skeleton } from '@/shared/ui/skeleton';

const SettingsPageComponent = dynamic(
  () => import('@/pages/settings').then((mod) => mod.SettingsPage),
  {
    loading: () => <div className="space-y-6"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>,
    ssr: false,
  }
);

// We still need the server component to fetch session data
export default async function SettingsPage() {
  const user = await getSession();

  // In a real app, user settings would also be fetched.
  // We augment the session user with mock settings data.
  const userWithSettings = user ? {
    ...user,
    location: "Москва",
    mainSport: "Valorant",
  } : null;

  return <SettingsPageComponent user={userWithSettings} />;
}

// This client file is now obsolete, but we'll keep it for reference during the refactor.
// It will be deleted in a subsequent step.
// All logic from the original SettingsClient has been moved to /src/pages/settings/index.tsx
