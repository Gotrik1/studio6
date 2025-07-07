

type Team = {
  name: string;
  logo: string | null;
  dataAiHint?: string | null;
  slug?: string;
};

export type BracketMatch = {
  id: number | string;
  team1?: Team;
  team2?: Team;
  score?: string;
  winner?: boolean;
  href?: string;
  date?: string;
  time?: string;
};

export type BracketRound = {
  name: string;
  matches: BracketMatch[];
};

type MediaItem = {
    id: string;
    type: string;
    src: string;
    description: string | null;
    hint: string | null;
    createdAt: string;
};

export type TournamentDetails = {
    id: string;
    name: string;
    slug: string;
    game: string;
    status: string;
    participantCount: number;
    registrationStartDate: string;
    registrationEndDate: string;
    tournamentStartDate: string;
    image: string;
    dataAiHint: string;
    description: string;
    prizePool: string;
    teamsCount: number;
    organizer: { name: string, avatar: string | null };
    schedule: {
        registration: string;
        groupStage: string;
        playoffs: string;
        finals: string;
    };
    teams: Team[];
    matches: BracketMatch[];
    rules: string;
    bracket: {
        rounds: BracketRound[];
    };
    media: MediaItem[];
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
