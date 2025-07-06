
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { Sponsor } from '@/entities/sponsor/model/types';
import type { Promotion } from '@/entities/promotion/model/types';
import type { SponsoredTeam } from '@/entities/sponsorship/model/types';


const SponsorProfile = dynamic(() => import('@/entities/user/ui/sponsor-profile').then(mod => mod.SponsorProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});

type SponsorProfileProps = {
  sponsor: Sponsor;
  activeCampaigns: Promotion[];
  sponsoredTeams: SponsoredTeam[];
};

export default function SponsorClient({ sponsor, activeCampaigns, sponsoredTeams }: SponsorProfileProps) {
  return <SponsorProfile 
            sponsor={sponsor}
            activeCampaigns={activeCampaigns} 
            sponsoredTeams={sponsoredTeams} 
        />;
}
