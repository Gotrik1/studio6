
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { MatchDetails } from "@/entities/match/model/types";

const MatchDetailsPageComponent = dynamic(() => import('@/pages/match-details').then(mod => mod.MatchDetailsPage), {
  loading: () => <div className="space-y-6"><Skeleton className="h-40 w-full" /><Skeleton className="h-64 w-full" /></div>,
  ssr: false,
});


interface MatchDetailsClientProps {
    match: MatchDetails;
}

export default function MatchDetailsClient({ match }: MatchDetailsClientProps) {
  return <MatchDetailsPageComponent match={match} />;
}
