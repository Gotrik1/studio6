
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

export type PlayerStats = {
  winLossData: { wins: number; losses: number };
  kdaByMonthData: { month: string; kda: number }[];
  winrateByMapData: { map: string; winrate: number }[];
  summary: {
    matches: number;
    winrate: number;
    winStreak: number;
    kda: number;
  };
};

export type CoachedPlayerSummary = {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  mainSport?: string;
  adherence?: number;
};

export type CoachedPlayer = CoachedPlayerSummary & {
  avatarHint: string;
  stats: { kda: string; winRate: string; favoriteMap: string };
  matchHistory: string;
  adherence: number;
  progress: number;
};

export type JudgedMatch = {
  id: string;
  team1: { name: string };
  team2: { name: string };
  resolution: string;
  timestamp: string | null;
};

export type Activity = {
  id: string;
  type: string;
  createdAt: string;
  metadata: {
    [key: string]: string;
  };
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

export type FullUserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  status?: "Активен" | "Забанен";
  xp?: number;
  activitySummary?: string;
  profileUrl?: string;
  location: string;
  mainSport: string;
  isVerified: boolean;
  dateOfBirth: string;
  age: number;
  preferredSports: string[];
  contacts: { telegram: string; discord: string };
  activities: Activity[];
  teams: UserTeam[];
  gallery: GalleryItem[];
  careerHistory: CareerHistoryItem[];
  organizedTournaments?: TournamentCrm[];
  coaching?: CoachedPlayerSummary[];
  judgedMatches?: JudgedMatch[];
};
