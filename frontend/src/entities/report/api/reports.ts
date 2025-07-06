

'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';
import { revalidateTag } from 'next/cache';
import type { Report } from '../model/types';

export type { Report };

export async function getReports(status: 'PENDING' | 'RESOLVED' | 'DISMISSED'): Promise<Report[]> {
  const result = await fetchWithAuth(`/reports?status=${status}`, { next: { tags: ['reports'] } });
  if (!result.success) {
    console.error('Failed to fetch reports:', result.error);
    return [];
  }
  return result.data;
}

export async function createReport(data: { reportedUserId: string; reason: string; context: string }) {
    const result = await fetchWithAuth('/reports', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return result;
}

export async function resolveReport(reportId: string, resolution: string, status: 'RESOLVED' | 'DISMISSED') {
    const result = await fetchWithAuth(`/reports/${reportId}/resolve`, {
        method: 'PATCH',
        body: JSON.stringify({ resolution, status }),
    });

    if (result.success) {
        revalidateTag('reports');
    }
    
    return result;
}
