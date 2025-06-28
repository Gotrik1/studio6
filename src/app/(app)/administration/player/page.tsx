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

export default function PlayerProfilePage() {
    const user = {
        name: "Alex 'CyberSlasher' Doe",
        email: 'alex.doe@prodvor.com',
        role: 'Игрок',
        avatar: 'https://placehold.co/100x100.png',
        location: "Москва, Россия",
        mainSport: "Valorant",
        status: "Капитан команды 'Кибер Орлы'",
        isVerified: true,
    };

  return <PlayerProfile user={user} isCurrentUser={false} />;
}
