import { JudgeProfile } from "@/components/judge-profile";
import { judgeUser, judgeAchievements } from "@/lib/mock-data";

export default function JudgeProfilePage() {
  return <JudgeProfile user={judgeUser} achievements={judgeAchievements} />;
}
