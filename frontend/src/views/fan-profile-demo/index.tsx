import FanClient from "@/app/(app)/administration/fan/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";
import { getTeams } from "@/entities/team/api/teams";
import { notFound } from "next/navigation";

const FAN_USER_ID = "10"; // Fan user from seed

export async function FanProfilePage() {
  const [pageData, achievements, allTeams] = await Promise.all([
    getPlayerProfile(FAN_USER_ID),
    getAchievementsForUser(FAN_USER_ID),
    getTeams(),
  ]);

  if (!pageData) {
    notFound();
  }

  // For demo, favorite teams are the first 2 teams
  const favoriteTeams = allTeams.slice(0, 2);

  return (
    <FanClient
      user={pageData.user}
      achievements={achievements}
      favoriteTeams={favoriteTeams}
      isCurrentUser={false}
    />
  );
}
