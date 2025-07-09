"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/shared/ui/skeleton";
import type { FullUserProfile } from "@/entities/user/model/types";
import type { Achievement } from "@/entities/achievement/model/types";

const JudgeProfile = dynamic(
  () =>
    import("@/entities/user/ui/judge-profile").then((mod) => mod.JudgeProfile),
  {
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    ),
    ssr: false,
  },
);

type JudgeProfileProps = {
  user: FullUserProfile;
  achievements: Achievement[];
};

export default function JudgeClient({ user, achievements }: JudgeProfileProps) {
  return <JudgeProfile user={user} achievements={achievements} />;
}
