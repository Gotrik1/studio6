import type { Team } from "@/entities/team/model/types";

export type SponsoredTeam = Team & {
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

export type SponsorshipOffer = {
  id: string;
  sponsor: {
    name: string;
    logo: string;
    logoHint: string;
  };
  offerText: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  teamId: string;
};
