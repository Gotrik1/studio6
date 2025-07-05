'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrainingProgramForm } from "@/widgets/training-program-form";
import type { ProgramFormValues } from "@/widgets/training-program-form";
import { useToast } from "@/shared/hooks/use-toast";
import type { TrainingProgram } from "@/entities/training-program/model/types";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTraining } from '@/shared/context/training-provider';

interface TrainingProgramEditPageProps {
    programId: string;
}

export function TrainingProgramEditPage({ programId }: TrainingProgramEditPageProps) {
    const { programs, updateProgram } = useTraining();
    const router = useRouter();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    
    const programToEdit = programs.find(p => p.id === programId);

    if (programs.length === 0) { // Loading state from provider
        return (
             <div className="space-y-6">
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-64 w-full" />
                 <Skeleton className="h-64 w-full" />
            </div>
        )
    }
    
    if (!programToEdit) {
        return <div>Программа не найдена.</div>
    }

    const handleSubmit = (data: ProgramFormValues) => {
        setIsSaving(true);
        const updatedProgram: TrainingProgram = {
            ...programToEdit,
            name: data.name,
            description: data.description || '',
            goal: data.goal,
            daysPerWeek: data.days.length,
            splitType: data.splitType,
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
        
        updateProgram(updatedProgram);

        setTimeout(() => {
            toast({
                title: "Программа обновлена!",
                description: `Программа "${data.name}" была успешно сохранена.`,
            });
            setIsSaving(false);
            router.push('/training/programs');
        }, 1000);
    };

    return (
        <TrainingProgramForm 
            onSubmit={handleSubmit}
            isSaving={isSaving}
            initialData={programToEdit}
        />
    );
}
