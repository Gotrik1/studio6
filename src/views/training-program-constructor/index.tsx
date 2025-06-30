'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTraining } from '@/app/providers/training-provider';
import { useToast } from '@/shared/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Wand2, Hand } from 'lucide-react';
import { TrainingProgramForm, type ProgramFormValues } from '@/widgets/training-program-form';
import { AiProgramGenerator } from '@/widgets/ai-program-generator';
import type { TrainingProgram } from '@/entities/training-program/model/types';

export function TrainingProgramConstructorPage() {
    const { addProgram } = useTraining();
    const router = useRouter();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [generatedProgram, setGeneratedProgram] = useState<TrainingProgram | null>(null);
    const [activeTab, setActiveTab] = useState('ai');

    const handleManualSubmit = (data: ProgramFormValues) => {
        setIsSaving(true);
        const newProgram: TrainingProgram = {
            id: `manual-${Date.now()}`,
            name: data.name,
            description: data.description || '',
            goal: data.goal,
            daysPerWeek: data.days.length,
            splitType: data.splitType,
            author: 'Вы',
            coverImage: 'https://placehold.co/600x400.png',
            coverImageHint: 'gym workout plan',
            isAiGenerated: false,
            weeklySplit: data.days.map((day, index) => ({
                day: index + 1,
                title: day.title,
                exercises: day.exercises.map(ex => ({ name: ex.name, sets: ex.sets, reps: ex.reps })),
            })),
        };
        addAndRedirect(newProgram);
    };

    const handleProgramGenerated = (program: TrainingProgram) => {
        setGeneratedProgram(program);
        setActiveTab('manual');
    };
    
    const addAndRedirect = (program: TrainingProgram) => {
        addProgram(program);
        setTimeout(() => {
            toast({
                title: "Программа создана!",
                description: `Ваша новая программа "${program.name}" была успешно сохранена.`,
            });
            setIsSaving(false);
            router.push('/training/programs');
        }, 500);
    }

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2 text-center">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Создание программы</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Воспользуйтесь помощью AI-тренера для быстрого старта или соберите свой план с нуля.
                </p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="ai"><Wand2 className="mr-2 h-4 w-4" /> AI-Генератор</TabsTrigger>
                    <TabsTrigger value="manual"><Hand className="mr-2 h-4 w-4" /> Ручной конструктор</TabsTrigger>
                </TabsList>
                <TabsContent value="ai" className="mt-4">
                    <AiProgramGenerator onProgramGenerated={handleProgramGenerated} />
                </TabsContent>
                <TabsContent value="manual" className="mt-4">
                   <TrainingProgramForm onSubmit={handleManualSubmit} isSaving={isSaving} initialData={generatedProgram || undefined}/>
                </TabsContent>
            </Tabs>
        </div>
    );
}
