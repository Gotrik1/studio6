export type TeamLeaderboardItem = {
  id: string;
  name: string;
  logo: string;
  dataAiHint: string;
  game: string;
  rank: number;
  wins: number;
  losses: number;
  draws: number;
  slug: string;
};

export type PlayerLeaderboardItem = {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  avatarHint: string;
};
