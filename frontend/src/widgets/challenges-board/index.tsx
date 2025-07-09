"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { Challenge } from "@/entities/challenge/model/types";
import type { User } from "@/shared/lib/types";
import { ChallengeCard } from "@/widgets/challenge-card";

interface ChallengesBoardProps {
  openChallenges: Challenge[];
  myChallenges: Challenge[];
  history: Challenge[];
  onAccept: (challengeId: string) => void;
  currentUser: User | null;
}

export function ChallengesBoard({
  openChallenges,
  myChallenges,
  history,
  onAccept,
  currentUser,
}: ChallengesBoardProps) {
  return (
    <Tabs defaultValue="open">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="open">Открытые вызовы</TabsTrigger>
        <TabsTrigger value="my">Мои вызовы</TabsTrigger>
        <TabsTrigger value="history">История</TabsTrigger>
      </TabsList>
      <TabsContent value="open" className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openChallenges.length > 0 ? (
            openChallenges.map((c) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                onAccept={onAccept}
                isAcceptable={c.creator.id !== currentUser?.id}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-8">
              Нет открытых вызовов. Создайте свой!
            </p>
          )}
        </div>
      </TabsContent>
      <TabsContent value="my" className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myChallenges.length > 0 ? (
            myChallenges.map((c) => <ChallengeCard key={c.id} challenge={c} />)
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-8">
              У вас нет активных вызовов.
            </p>
          )}
        </div>
      </TabsContent>
      <TabsContent value="history" className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.length > 0 ? (
            history.map((c) => <ChallengeCard key={c.id} challenge={c} />)
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-8">
              История вызовов пуста.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
