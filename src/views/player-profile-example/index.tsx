
import PlayerClient from "@/app/(app)/administration/player/client";
import { achievements, teams, recentMatches, gallery, careerHistory } from "@/shared/lib/mock-data/profiles";
import { differenceInYears } from "date-fns";

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
  dateOfBirth: '1998-05-15',
  age: differenceInYears(new Date(), new Date('1998-05-15')),
  preferredSports: ["Футбол", "Баскетбол", "Valorant"],
  contacts: {
      telegram: '@player_example',
      discord: 'player#1234'
  }
};

export function PlayerProfilePage() {
    // This is an example player profile page for demonstration in the admin section.
    // In a real scenario, this data might come from a specific user ID lookup.
    return <PlayerClient 
        user={examplePlayerUser} 
        isCurrentUser={true}
        achievements={achievements}
        teams={teams}
        recentMatches={recentMatches}
        gallery={gallery}
        careerHistory={careerHistory}
    />;
}
