'use server';

import type { TrainingProgram } from '@/entities/training-program/model/types';

export async function getTrainingPrograms(): Promise<TrainingProgram[]> {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/training/programs`, {
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error('Failed to fetch programs:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching programs:', error);
        return [];
    }
}
