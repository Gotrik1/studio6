
import PlayerClient from "@/app/(app)/administration/player/client";
import { achievements, teams, recentMatches, gallery, careerHistory } from "@/shared/lib/mock-data/profiles";

const examplePlayerUser = {
  id: 'player-example-001',
  name: 'Пример Игрока',
  email: 'player.example@example.com',
  role: 'Игрок',
  avatar: 'https://placehold.co/100x100.png',
  location: "Москва, Россия",
  mainSport: "Футбол",
  status: "Активен",
  isVerified: true,
  xp: 1250,
};

export function PlayerProfilePage() {
    // This is an example player profile page for demonstration in the admin section.
    // In a real scenario, this data might come from a specific user ID lookup.
    return <PlayerClient 
        user={examplePlayerUser} 
        isCurrentUser={false}
        achievements={achievements}
        teams={teams}
        recentMatches={recentMatches}
        gallery={gallery}
        careerHistory={careerHistory}
    />;
}
