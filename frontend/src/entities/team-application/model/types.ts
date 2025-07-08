

import type { User } from '@/shared/lib/types';

export type Application = {
    id: string;
    teamId: string;
    message?: string;
    user: User;
    team: {
        id: string;
        name: string;
        slug: string;
        captain: { name: string } | null;
    };
    statsSummary?: string;
};

export type JoinRequest = Application;


export type Participant = {
    id: string;
    name: string;
    captain: { name: string; } | null;
    members: {
        id: string;
        name: string;
        avatar: string | null;
        role: string;
    }[];
};
