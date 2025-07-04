

export type CareerHistoryItem = {
    id: string;
    teamName: string;
    period: string;
    role: string;
    review: string;
};

export type GalleryItem = {
    id: string;
    src: string;
    alt: string;
    dataAiHint: string;
};

export type UserTeam = {
  id: string;
  name: string;
  role: string;
  logo: string | null;
  dataAiHint: string | null;
  slug: string;
  rank: number;
  game: string;
};
