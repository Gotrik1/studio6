import { judgeUser, judgeAchievements } from "@/lib/mock-data";
import JudgeClient from "./client";

export default function JudgeProfilePage() {
  return <JudgeClient user={judgeUser} achievements={judgeAchievements} />;
}
