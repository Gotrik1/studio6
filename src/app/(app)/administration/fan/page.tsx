import { fanUser, fanAchievements } from "@/lib/mock-data/fan-profile";
import FanClient from "./client";

export default function FanProfilePage() {
  return <FanClient user={fanUser} achievements={fanAchievements} />;
}
