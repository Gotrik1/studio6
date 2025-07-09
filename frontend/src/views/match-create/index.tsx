"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { AiMatchWizard } from "@/widgets/ai-match-wizard";
import { ManualMatchForm } from "@/widgets/manual-match-form";
import { Wand2, Hand } from "lucide-react";

export function NewMatchPage() {
  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
      <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Организация матча
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Воспользуйтесь помощью AI-ассистента или создайте вызов вручную,
          выбрав конкретного соперника.
        </p>
      </div>
      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="ai">
            <Wand2 className="mr-2 h-4 w-4" /> AI-Помощник
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Hand className="mr-2 h-4 w-4" /> Ручной вызов
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ai">
          <AiMatchWizard />
        </TabsContent>
        <TabsContent value="manual">
          <ManualMatchForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
