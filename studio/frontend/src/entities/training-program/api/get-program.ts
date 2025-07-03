
'use client';

import { useTraining } from "@/shared/context/training-provider";
import type { TrainingProgram } from '../model/types';

// This is now a hook because it needs to access the context
export function useProgramById(id: string): TrainingProgram | null {
    const { programs } = useTraining();
    const program = programs.find(p => p.id === id);
    return program || null;
}
