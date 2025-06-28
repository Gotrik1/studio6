import dynamic from 'next/dynamic';
import { judgeUser, judgeAchievements } from "@/lib/mock-data";
import { Skeleton } from '@/components/ui/skeleton';

const JudgeProfile = dynamic(() => import('@/components/judge-profile').then(mod => mod.JudgeProfile), {
  loading: () => <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
  </div>,
  ssr: false,
});


export default function JudgeProfilePage() {
  return <JudgeProfile user={judgeUser} achievements={judgeAchievements} />;
}
