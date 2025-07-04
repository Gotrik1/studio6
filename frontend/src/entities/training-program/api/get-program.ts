'use server';

import type { TrainingProgram } from '../model/types';
import { getTrainingPrograms } from './get-programs';

// This is now a server-side function to fetch data for a specific program page
export async function getProgramById(id: string): Promise<TrainingProgram | null> {
    try {
        // In a real app, this would be a direct API call: /training/programs/${id}
        // For now, we fetch all and find, which is inefficient but works for the demo.
        const programs = await getTrainingPrograms();
        const program = programs.find(p => p.id === id);
        return program || null;
    } catch (error) {
        console.error("Failed to get program by id:", error);
        return null;
    }
}
