
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { TrainingProgramForm, type ProgramFormValues } from '@/widgets/training-program-form';
import { AiProgramGenerator } from '@/widgets/ai-program-generator';
import { Wand2, Hand } from 'lucide-react';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { useTraining } from '@/shared/context/training-provider';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function TrainingProgramConstructorPage() {
    const { addProgram } = useTraining();
    const { toast } = useToast();
    const router = useRouter();

    const handleProgramGenerated = (program: TrainingProgram) => {
        addProgram(program);
        toast({
            title: "Программа сгенерирована!",
            description: "Новая программа добавлена в 'Мои программы'.",
        });
        router.push('/training/programs');
    };
    
    const handleManualSubmit = (data: ProgramFormValues) => {
        const newProgram: TrainingProgram = {
            id: `manual-${Date.now()}`,
            name: data.name,
            description: data.description || '',
            goal: data.goal,
            daysPerWeek: data.days.length,
            splitType: data.splitType,
            author: 'Вы', // or current user's name
            coverImage: 'https://placehold.co/600x400.png',
            coverImageHint: 'dumbbell weights',
            weeklySplit: data.days.map((day, index) => ({
                day: index + 1,
                title: day.title,
                exercises: day.exercises.map(ex => ({ 
                    name: ex.name, 
                    sets: ex.sets, 
                    reps: ex.reps,
                    plannedWeight: ex.plannedWeight,
                    isSupersetWithPrevious: ex.isSupersetWithPrevious || false,
                    technique: ex.technique || '',
                })),
            })),
        };
        addProgram(newProgram);
         toast({
            title: "Программа создана!",
            description: `Ваша программа "${data.name}" успешно сохранена.`,
        });
        router.push('/training/programs');
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
                <TrainingProgramForm onSubmit={handleManualSubmit} isSaving={false} />
            </TabsContent>
        </Tabs>
    );
}
