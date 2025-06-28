import { coachUser, coachAchievements } from "@/lib/mock-data/coach-profile";
import CoachClient from "./client";

export default function CoachProfilePage() {
  return <CoachClient user={coachUser} achievements={coachAchievements} />;
}
