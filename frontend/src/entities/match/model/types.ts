

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
    // The following are optional as they are not guaranteed to be in the API response
    events?: { time: string; event: string; player: string; team: string; }[];
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
