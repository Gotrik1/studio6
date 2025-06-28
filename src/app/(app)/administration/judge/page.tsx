import { judgeUser, judgeAchievements } from "@/lib/mock-data/profiles";
import JudgeClient from "./client";

export default function JudgeProfilePage() {
  return <JudgeClient user={judgeUser} achievements={judgeAchievements} />;
}
