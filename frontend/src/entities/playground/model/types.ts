export type KingTeam = {
  id: string;
  name: string;
  logo: string;
  dataAiHint: string;
  game: string;
  rank: number;
  slug: string;
  wins: number;
};

export type PlaygroundReview = {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  rating: number;
  comment: string;
  timestamp: string;
};

export type Playground = {
  id: string;
  name: string;
  address: string;
  type: string;
  coverImage: string | null;
  coverImageHint: string | null;
  surface: string;
  features: string[];
  rating: number;
  checkIns: number;
  status: "APPROVED" | "PENDING_MODERATION";
  creator: {
    name: string;
    avatar: string | null;
  };
  kingOfTheCourt?: KingTeam | null;
  reviews: PlaygroundReview[];
};
