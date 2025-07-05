
export type Team = {
    name: string;
    motto: string;
    logo: string | null;
    dataAiHint: string | null;
    game: string;
    rank: number;
    members: number;
    captain: string;
    slug: string;
    homePlaygroundId: string | null;
};

export type TeamRosterMember = {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    rating: string;
    status: string;
};

export type TeamDetails = {
    id: string;
    name: string;
    motto: string;
    logo: string | null;
    dataAiHint: string | null;
    game: string;
    rank: number;
    membersCount: number;
    captainId: string; // Changed from captainName
    slug: string;
    homePlaygroundId: string | null;
    roster: TeamRosterMember[];
};

export type UserTeam = {
  id: string;
  name: string;
  role: string;
  logo: string | null;
  dataAiHint: string | null;
  slug: string;
  rank: number | null;
  game: string;
};
