

export enum MatchEventType {
  GOAL = "GOAL",
  ASSIST = "ASSIST",
  YELLOW_CARD = "YELLOW_CARD",
  RED_CARD = "RED_CARD",
  SUBSTITUTION = "SUBSTITUTION",
  KILL = "KILL",
  DEATH = "DEATH",
  ASSIST_ESPORTS = "ASSIST_ESPORTS",
  BOMB_PLANTED = "BOMB_PLANTED",
  BOMB_DEFUSED = "BOMB_DEFUSED",
  ROUND_WIN = "ROUND_WIN",
  ROUND_LOSS = "ROUND_LOSS",
  OTHER = "OTHER",
}

export type MatchEvent = {
    time: string;
    event: MatchEventType;
    player: string;
    team: string;
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
    media?: { type: string; src: string; hint: string; }[];
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
