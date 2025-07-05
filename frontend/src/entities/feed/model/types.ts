import type { User } from "@/shared/lib/types";

export type Activity = {
    id: string;
    type: 'MATCH_PLAYED' | 'TEAM_JOINED' | 'TOURNAMENT_REGISTERED' | 'STATUS_POSTED' | 'ACHIEVEMENT_UNLOCKED';
    user: Pick<User, 'id' | 'name' | 'avatar'>;
    metadata: any;
    timestamp: string;
};
