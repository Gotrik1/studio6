
import { trainingPrograms } from '@/shared/lib/mock-data/training-programs';
import type { TrainingProgram } from '../model/types';

export function getProgramById(id: string): TrainingProgram | null {
    const program = trainingPrograms.find(p => p.id === id);
    return program || null;
}
