
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

export type TournamentCrm = {
    id: string;
    name: string;
    sport: string;
    status: string;
    participants: number;
    maxParticipants: number;
    startDate: string;
    organizer: string;
    rules: string;
};

export type Measurement = {
    id: string;
    date: string;
    weight: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thigh?: number;
};
