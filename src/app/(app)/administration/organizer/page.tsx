import { organizerUser, organizerAchievements } from "@/lib/mock-data/organizer-profile";
import OrganizerClient from "./client";

export default function OrganizerProfilePage() {
  return <OrganizerClient user={organizerUser} achievements={organizerAchievements} />;
}
