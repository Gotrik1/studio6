import { adminUser, adminAchievements } from "@/lib/mock-data/admin-profile";
import AdministratorClient from "./client";

export default function AdministratorProfilePage() {
  return <AdministratorClient user={adminUser} achievements={adminAchievements} />;
}
