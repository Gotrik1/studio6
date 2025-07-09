export type LeagueTeam = {
  id: string;
  name: string;
  logo: string;
  logoHint: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

export type LeagueMatch = {
  id: string;
  team1: { name: string; logo: string; logoHint: string };
  team2: { name: string; logo: string; logoHint: string };
  score: string;
  date: string;
};

export type League = {
  id: string;
  name: string;
  description: string;
  game: string;
  image: string;
  imageHint: string;
  teams: LeagueTeam[];
  matches: LeagueMatch[];
};

export type LeagueDetails = League;
