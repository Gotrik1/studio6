

export type SponsoredTeam = {
    slug: string;
    name: string;
    logo: string;
    logoHint: string;
    investment: string;
    since: string;
    id: string;
    game: string;
    motto: string;
    dataAiHint: string | null;
    rank: number;
    homePlaygroundId: string | null;
    members: number;
    captain: string;
};

export type TeamSeekingSponsorship = {
    slug: string;
    name: string;
    logo: string;
    logoHint: string;
    game: string;
    pitch: string;
};

export type SponsorshipDashboardData = {
    sponsoredTeams: SponsoredTeam[];
    teamsSeekingSponsorship: TeamSeekingSponsorship[];
};

export type SponsorshipOffer = {
  id: string;
  sponsor: {
    name: string;
    logo: string;
    logoHint: string;
  };
  offerText: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  teamId: string;
};
