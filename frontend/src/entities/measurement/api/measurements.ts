'use server';

import type { Measurement } from '@/entities/user/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';

export async function getMeasurements(): Promise<Measurement[]> {
    const result = await fetchWithAuth('/measurements');
    if (!result.success) {
        console.error('Failed to fetch measurements:', result.error);
        return [];
    }
    return result.data.map((m: any) => ({ ...m, date: new Date(m.date).toISOString().split('T')[0] }));
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
