export type LfgLobby = {
    id: string;
    type: 'GAME' | 'TRAINING';
    sport: string;
    location: string;
    playgroundId?: string | null;
    startTime: Date;
    endTime: Date;
    playersNeeded: number;
    playersJoined: number;
    comment: string;
    creator: {
        name: string;
        avatar: string | null;
    };
};
