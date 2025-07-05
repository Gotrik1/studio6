
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ManualTournamentForm } from '@/widgets/tournament-wizard/manual-tournament-form';
import { AiTournamentWizard } from '@/widgets/ai-tournament-wizard';
import { Wand2, Hand } from 'lucide-react';

export function NewTournamentWizardPage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2 text-center">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Создание турнира</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Воспользуйтесь помощью AI-ассистента для быстрого создания концепции турнира или настройте все параметры вручную.
                </p>
            </div>
            <Tabs defaultValue="ai" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="ai"><Wand2 className="mr-2 h-4 w-4" /> AI-Мастер</TabsTrigger>
                    <TabsTrigger value="manual"><Hand className="mr-2 h-4 w-4" /> Ручной режим</TabsTrigger>
                </TabsList>
                <TabsContent value="ai" className="mt-4">
                    <AiTournamentWizard />
                </TabsContent>
                <TabsContent value="manual" className="mt-4">
                    <ManualTournamentForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
