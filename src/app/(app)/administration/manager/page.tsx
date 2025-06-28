import { managerUser, managerAchievements } from "@/lib/mock-data/manager-profile";
import ManagerClient from "./client";

export default function ManagerProfilePage() {
  return <ManagerClient user={managerUser} achievements={managerAchievements} />;
}
