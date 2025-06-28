import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const PlayerProfile = dynamic(() => import('@/components/player-profile').then(mod => mod.PlayerProfile), {
    loading: () => <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
    </div>,
    ssr: false,
});


export default async function ProfilePage() {
  const user = await getSession();
  if (!user) redirect('/auth');

  // Augment user data for this page example
  const userProfile = {
      ...user,
      location: "Москва, Россия",
      mainSport: "Valorant",
      status: "Капитан команды 'Кибер Орлы'",
      isVerified: true,
  }

  return <PlayerProfile user={userProfile} isCurrentUser={true} />;
}
