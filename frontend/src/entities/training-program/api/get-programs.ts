'use server';

import type { TrainingProgram } from '@/entities/training-program/model/types';

export async function getTrainingPrograms(): Promise<TrainingProgram[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!baseUrl) {
            console.error('Backend URL not configured');
            return [];
        }
        const response = await fetch(`${baseUrl}/training/programs`, {
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
