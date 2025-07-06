'use server';

import type { TrainingProgram } from '../model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

// Using the type from the form values in TrainingProgramForm seems reasonable.
export type ProgramFormValues = {
  name: string;
  description?: string;
  goal: 'Набор массы' | 'Снижение веса' | 'Рельеф' | 'Сила';
  splitType: 'Full-body' | 'Split' | 'Upper/Lower';
  days: Array<{
    title: string;
    exercises: Array<{
      id: string;
      name: string;
      sets: string;
      reps: string;
      plannedWeight?: string;
      isSupersetWithPrevious?: boolean;
      technique?: string;
    }>;
  }>;
};

type CreateProgramData = Omit<ProgramFormValues, 'days'> & {
  weeklySplit: ProgramFormValues['days'];
};

export async function createTrainingProgram(data: ProgramFormValues) {
    const payload: CreateProgramData = {
        ...data,
        weeklySplit: data.days,
    };
    const result = await fetchWithAuth('/training/programs', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    if (result.success) {
        revalidateTag('training-programs');
    }
    return result;
}

export async function updateTrainingProgram(id: string, data: ProgramFormValues) {
     const payload: CreateProgramData = {
        ...data,
        weeklySplit: data.days,
    };
    const result = await fetchWithAuth(`/training/programs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
    if (result.success) {
        revalidateTag('training-programs');
    }
    return result;
}

export async function deleteTrainingProgram(id: string) {
    const result = await fetchWithAuth(`/training/programs/${id}`, {
        method: 'DELETE',
    });
     if (result.success) {
        revalidateTag('training-programs');
    }
    return result;
}
