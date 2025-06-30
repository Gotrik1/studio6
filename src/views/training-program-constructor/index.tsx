
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTraining } from '@/app/providers/training-provider';
import { useToast } from '@/shared/hooks/use-toast';
import { TrainingProgramForm } from '@/widgets/training-program-form';
import type { ProgramFormValues } from '@/widgets/training-program-form';
import type { TrainingProgram } from '@/entities/training-program/model/types';

export function TrainingProgramConstructorPage() {
    const { addProgram } = useTraining();
    const router = useRouter();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (data: ProgramFormValues) => {
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
        
        addProgram(newProgram);

        setTimeout(() => {
            toast({
                title: "Программа создана!",
                description: `Ваша новая программа "${data.name}" была успешно сохранена.`,
            });
            setIsSaving(false);
            router.push('/training/programs');
        }, 1000);
    };

    return <TrainingProgramForm onSubmit={handleSubmit} isSaving={isSaving} />;
}
