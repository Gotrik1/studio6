import { moderatorUser, moderatorAchievements } from "@/lib/mock-data/moderator-profile";
import ModeratorClient from "./client";

export default function ModeratorProfilePage() {
  return <ModeratorClient user={moderatorUser} achievements={moderatorAchievements} />;
}
