"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/shared/ui/skeleton";
import type {
  FullUserProfile,
  UserTeam,
  CareerHistoryItem,
  GalleryItem,
  PlayerStats,
} from "@/entities/user/model/types";
import type { Achievement } from "@/entities/achievement/model/types";
import type { PlayerActivityItem } from "@/widgets/player-activity-feed";

const PlayerProfile = dynamic(
  () =>
    import("@/entities/player/ui/player-profile").then(
      (mod) => mod.PlayerProfile,
    ),
  {
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    ),
    ssr: false,
  },
);

type PlayerClientProps = {
  user: FullUserProfile;
  isCurrentUser: boolean;
  achievements: Achievement[];
  teams: UserTeam[];
  gallery: GalleryItem[];
  careerHistory: CareerHistoryItem[];
  playerActivity: PlayerActivityItem[];
  stats: PlayerStats | null;
};

export default function PlayerClient({
  user,
  isCurrentUser,
  achievements,
  teams,
  gallery,
  careerHistory,
  playerActivity,
  stats,
}: PlayerClientProps) {
  return (
    <PlayerProfile
      user={user}
      isCurrentUser={isCurrentUser}
      achievements={achievements}
      teams={teams}
      gallery={gallery}
      careerHistory={careerHistory}
      playerActivity={playerActivity}
      stats={stats}
    />
  );
}
