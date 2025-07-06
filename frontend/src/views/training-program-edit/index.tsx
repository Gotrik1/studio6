
'use client';

import { useRouter } from 'next/navigation';
import { TrainingProgramForm, type ProgramFormValues } from '@/widgets/training-program-form';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import { useTraining } from '@/shared/context/training-provider';

interface TrainingProgramEditPageProps {
    programId: string;
}

export function TrainingProgramEditPage({ programId }: TrainingProgramEditPageProps) {
    const { programs, updateProgram, isLoading } = useTraining();
    const router = useRouter();
    const { toast } = useToast();
    
    const programToEdit = programs.find(p => p.id === programId);

    if (isLoading) {
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

    const handleSubmit = async (data: ProgramFormValues): Promise<void> => {
        const success = await updateProgram(programId, data);
        if (success) {
            toast({
                title: "Программа обновлена!",
                description: `Программа "${data.name}" была успешно сохранена.`,
            });
            router.push('/training/programs');
        }
    };

    return (
        <TrainingProgramForm 
            onSubmit={handleSubmit}
            initialData={programToEdit}
        />
    );
}
