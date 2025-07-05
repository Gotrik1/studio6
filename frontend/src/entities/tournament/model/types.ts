

type Team = {
  name: string;
  logo: string | null;
  dataAiHint?: string | null;
  slug?: string;
};

type BracketMatch = {
  id: number | string;
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
    id: string;
    name: string;
    slug: string;
    game: string;
    status: string;
    image: string;
    dataAiHint: string;
    description: string;
    prizePool: string;
    teamsCount: number;
    organizer: { name: string, logo: string | null };
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

export type Tournament = {
  id: string;
  name: string;
  game: string;
  prize: string;
  status: string;
  date: string;
  image: string;
  dataAiHint: string;
  slug: string;
};
