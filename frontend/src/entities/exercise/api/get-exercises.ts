'use server';

import type { Exercise } from '@/entities/exercise/model/types';

export async function getExercises(): Promise<Exercise[]> {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/training/exercises`, {
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error('Failed to fetch exercises:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching exercises:', error);
        return [];
    }
}
