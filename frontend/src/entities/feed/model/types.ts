import type { User } from "@/shared/lib/types";

type BaseActivity = {
    id: string;
    user: Pick<User, 'id' | 'name' | 'avatar'>;
    timestamp: string;
    createdAt: string; // Add this to match backend data
}

// Specific metadata types
export type StatusPostedMetadata = {
    text: string;
};
export type MatchPlayedMetadata = {
    team: string;
    teamHref: string;
    opponent: string;
    result: 'Победа' | 'Поражение' | 'Ничья';
    score: string;
    icon: 'Trophy';
};
export type TeamJoinedMetadata = {
    teamName: string;
    teamHref: string;
    icon: 'Users';
};
export type TournamentRegisteredMetadata = {
    teamName: string;
    tournamentName: string;
    tournamentHref: string;
    icon: 'Trophy';
};
export type AchievementUnlockedMetadata = {
    title: string;
    icon: 'Award';
};
export type PlaygroundCheckInMetadata = {
    comment: string;
    photo?: string;
};


// Discriminated union for activities
export type StatusPostedActivity = BaseActivity & {
    type: 'STATUS_POSTED';
    metadata: StatusPostedMetadata;
};
export type MatchPlayedActivity = BaseActivity & {
    type: 'MATCH_PLAYED';
    metadata: MatchPlayedMetadata;
};
export type TeamJoinedActivity = BaseActivity & {
    type: 'TEAM_JOINED';
    metadata: TeamJoinedMetadata;
};
export type TournamentRegisteredActivity = BaseActivity & {
    type: 'TOURNAMENT_REGISTERED';
    metadata: TournamentRegisteredMetadata;
};
export type AchievementUnlockedActivity = BaseActivity & {
    type: 'ACHIEVEMENT_UNLOCKED';
    metadata: AchievementUnlockedMetadata;
};
export type PlaygroundCheckInActivity = BaseActivity & {
    type: 'PLAYGROUND_CHECK_IN';
    metadata: PlaygroundCheckInMetadata;
};

// The final Activity type is a union of all specific activity types.
export type Activity = 
    | StatusPostedActivity
    | MatchPlayedActivity
    | TeamJoinedActivity
    | TournamentRegisteredActivity
    | AchievementUnlockedActivity
    | PlaygroundCheckInActivity;
