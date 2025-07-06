import type { Sponsor } from '@/entities/sponsor/model/types';

export type SponsoredTeam = {
    slug: string;
    name: string;
    logo: string;
    logoHint: string;
    investment: string;
    since: string;
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
