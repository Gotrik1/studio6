
export type CareerHistoryItem = {
    teamName: string;
    period: string;
    role: string;
    review: string;
};

export type UserTeam = {
  name: string;
  role: string;
  logo: string | null;
  dataAiHint: string | null;
  slug: string;
  rank: number;
  game: string;
};
