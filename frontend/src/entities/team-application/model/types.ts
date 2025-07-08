
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
};

export type JoinRequest = Application;
