export type ChallengeCreator = {
  id: string;
  name: string;
  avatar: string | null;
  avatarHint: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  discipline: string;
  wager: number;
  creator: ChallengeCreator;
  opponent?: ChallengeCreator | null;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  result?: string | null;
};
