

export type MatchEventType = "GOAL" | "ASSIST" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION" | "KILL" | "DEATH" | "ASSIST_ESPORTS" | "BOMB_PLANTED" | "BOMB_DEFUSED" | "ROUND_WIN" | "ROUND_LOSS" | "OTHER";

export type MatchEvent = {
    time: string;
    event: MatchEventType;
    player: string;
    team: string;
};

export type TournamentMedia = {
    id: string;
    type: string;
    src: string;
    description: string | null;
    hint: string | null;
    createdAt: string;
};

export type BracketMatch = {
  id: number | string;
  team1?: { name: string; logo: string | null; dataAiHint?: string | null; slug?: string; };
  team2?: { name: string; logo: string | null; dataAiHint?: string | null; slug?: string; };
  score?: string;
  winner?: boolean;
  href?: string;
  date?: string;
  time?: string;
  events?: MatchEvent[];
};

export type BracketRound = {
  name: string;
  matches: BracketMatch[];
};

export type MatchDetails = {
    id: string;
    tournament: string;
    status: string;
    score: string;
    date: string;
    time: string;
    location: string;
    referee: { name: string };
    team1: { name: string; logo: string | null; logoHint: string | null; };
    team2: { name: string; logo: string | null; logoHint: string | null; };
    lineups: {
        team1: { name: string; role: string; avatar: string; avatarHint: string; }[];
        team2: { name:string; role: string; avatar: string; avatarHint: string; }[];
    };
    events?: MatchEvent[];
    teamStats?: {
        [key: string]: { label: string; team1: number; team2: number; }
    } | null;
    media?: TournamentMedia[];
    bracket: {
      rounds: BracketRound[];
    };
};

export type Match = {
    id: string;
    team1: { id: string; name: string; logo: string; logoHint: string; };
    team2: { id: string; name: string; logo: string; logoHint: string; };
    score: string;
    tournament: string;
    game: string;
    date: string;
    status: string;
    href: string;
    playgroundId?: string | null;
    disputeReason?: string;
    timestamp?: string;
    resolution?: string;
};
