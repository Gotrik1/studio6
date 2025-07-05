'use server';

import type { Measurement } from '@/entities/user/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getMeasurements(): Promise<Measurement[]> {
    const result = await fetchWithAuth('/measurements', {
        next: { tags: ['measurements'] }
    });
    if (!result.success) {
        console.error('Failed to fetch measurements:', result.error);
        return [];
    }
    // The backend returns dates as ISO strings. We just cast the type.
    // This prevents timezone issues that arise from stripping time information.
    return result.data as Measurement[];
}


export async function createMeasurement(data: Omit<Measurement, 'id'>) {
    const result = await fetchWithAuth('/measurements', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (result.success) {
        revalidateTag('measurements');
    }
    
    return result;
}
