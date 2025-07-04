
import type { allTournaments } from '@/shared/lib/mock-data/tournaments';

type Team = {
  name: string;
  logo: string;
  dataAiHint?: string;
  slug?: string;
};

type BracketMatch = {
  id: number;
  team1?: Team;
  team2?: Team;
  score?: string;
  winner?: boolean;
  href?: string;
  date?: string;
  time?: string;
};

type BracketRound = {
  name: string;
  matches: BracketMatch[];
};

export type TournamentDetails = {
    name: string;
    slug: string;
    game: string;
    status: string;
    image: string;
    dataAiHint: string;
    description: string;
    prizePool: string;
    teamsCount: number;
    organizer: { name: string, logo: string };
    schedule: {
        registration: string;
        groupStage: string;
        playoffs: string;
        finals: string;
    };
    teams: Team[];
    rules: string;
    bracket: {
        rounds: BracketRound[];
    };
    media: { type: string, src: string, hint: string }[];
};

export type Tournament = (typeof allTournaments)[0];
