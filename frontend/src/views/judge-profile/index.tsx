import JudgeClient from "@/app/(app)/administration/judge/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";
import { notFound } from "next/navigation";

const JUDGE_USER_ID = '4'; // Hardcoded for demo

export function JudgeProfilePage() {
    return <div>This page is a demo. Please use the dynamic profile page.</div>;
}
