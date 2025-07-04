'use server';

import type { TrainingProgram } from '@/entities/training-program/model/types';
import { trainingPrograms as mockPrograms } from '@/shared/lib/mock-data/training-programs';

export async function getTrainingPrograms(): Promise<TrainingProgram[]> {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/training/programs`, {
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error('Failed to fetch programs, falling back to mock data:', response.statusText);
            return mockPrograms; // Fallback for now
        }
        
        // This will likely be empty until the backend actually returns data
        const data = await response.json();
        
        if (data.length === 0) {
             console.warn('API returned empty program list, using mock data for demo.');
             return mockPrograms;
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching programs, falling back to mock data:', error);
        return mockPrograms; // Fallback for now
    }
}
