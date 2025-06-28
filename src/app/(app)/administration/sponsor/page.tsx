import { sponsorUser, sponsorAchievements } from "@/lib/mock-data/sponsor-profile";
import SponsorClient from "./client";

export default function SponsorProfilePage() {
  return <SponsorClient user={sponsorUser} achievements={sponsorAchievements} />;
}
