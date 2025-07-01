'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Gamepad2, HeartPulse, Zap } from 'lucide-react';
import type { User } from "@/shared/lib/types";
import { AiCoachTab } from './ai-coach-tab';
import { EsportsAnalysisTab } from './esports-analysis-tab';
import { HolisticAnalysisTab } from '@/widgets/holistic-analysis-tab';

interface AiAnalystTabProps {
  user: User & {
    mainSport: string;
  };
}

export function AiAnalystTab({ user }: AiAnalystTabProps) {
    return (
        <Tabs defaultValue="holistic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="holistic"><Zap className="mr-2 h-4 w-4"/>Комплексный</TabsTrigger>
                <TabsTrigger value="esports"><Gamepad2 className="mr-2 h-4 w-4"/>Киберспорт</TabsTrigger>
                <TabsTrigger value="physical"><HeartPulse className="mr-2 h-4 w-4" />Физ. подготовка</TabsTrigger>
            </TabsList>
            <TabsContent value="holistic" className="mt-4">
                <HolisticAnalysisTab />
            </TabsContent>
            <TabsContent value="esports" className="mt-4">
                <EsportsAnalysisTab user={user} />
            </TabsContent>
            <TabsContent value="physical" className="mt-4">
                <AiCoachTab user={user} />
            </TabsContent>
        </Tabs>
    );
}
