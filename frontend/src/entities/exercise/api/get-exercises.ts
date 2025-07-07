
'use server';

import type { Exercise } from '@/entities/exercise/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

export async function getExercises(): Promise<Exercise[]> {
    const result = await fetchWithAuth<Exercise[]>('/training/exercises');
    if (!result.success || !result.data) {
        console.error('Failed to fetch exercises:', result.error);
        return [];
    }
    return result.data;
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
    const result = await fetchWithAuth<Exercise>(`/training/exercises/${id}`);
    if (!result.success || !result.data) {
        console.error(`Failed to fetch exercise ${id}:`, result.error);
        return null;
    }
    return result.data;
}
