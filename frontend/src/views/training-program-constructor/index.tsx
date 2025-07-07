

'use client';

import { useState } from 'react';
import { TrainingProgramForm, type ProgramFormValues } from '@/widgets/training-program-form';
import { AiProgramGenerator } from '@/widgets/ai-program-generator';
import { Wand2, Hand } from 'lucide-react';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { useTraining } from '@/app/providers/training-provider';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';


export default function TrainingProgramConstructorPage() {
    const { addProgram } = useTraining();
    const { toast } = useToast();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleProgramGenerated = async (program: TrainingProgram) => {
        setIsSaving(true);
        const success = await addProgram({
            name: program.name,
            description: program.description,
            goal: program.goal,
            splitType: program.splitType,
            days: program.weeklySplit.map(day => ({
                title: day.title,
                exercises: day.exercises.map(ex => ({...ex, id: `temp-${Math.random()}`}))
            }))
        });
        if (success) {
            toast({
                title: "Программа сгенерирована!",
                description: "Новая программа добавлена в 'Мои программы'.",
            });
            router.push('/training/programs');
        }
        setIsSaving(false);
    };
    
    const handleManualSubmit = async (data: ProgramFormValues) => {
        setIsSaving(true);
        const success = await addProgram(data);
        if (success) {
            toast({
                title: "Программа создана!",
                description: `Ваша программа "${data.name}" успешно сохранена.`,
            });
            router.push('/training/programs');
        }
        setIsSaving(false);
    };

    return (
        <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="ai"><Wand2 className="mr-2 h-4 w-4" /> AI-Генератор</TabsTrigger>
                <TabsTrigger value="manual"><Hand className="mr-2 h-4 w-4" /> Ручной режим</TabsTrigger>
            </TabsList>
            <TabsContent value="ai">
                <AiProgramGenerator onProgramGenerated={handleProgramGenerated} />
            </TabsContent>
            <TabsContent value="manual">
                <TrainingProgramForm onSubmit={handleManualSubmit} isSaving={isSaving} />
            </TabsContent>
        </Tabs>
    );
}
