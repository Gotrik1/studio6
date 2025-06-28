
'use client';

import dynamic from 'next/dynamic';
import type { TournamentDetails } from "@/entities/tournament/model/types";
import { Skeleton } from '@/shared/ui/skeleton';

const TournamentDetailsPageComponent = dynamic(
  () => import('@/pages/tournament-details').then((mod) => mod.TournamentDetailsPage),
  {
    loading: () => <Skeleton className="h-screen w-full" />,
    ssr: false,
  }
);

interface TournamentClientPageProps {
    tournament: TournamentDetails;
}

export default function TournamentDetailsPageClient({ tournament }: TournamentClientPageProps) {
  return <TournamentDetailsPageComponent tournament={tournament} />;
}
