'use server';

import type { SponsorshipDashboardData } from '@/entities/sponsorship/model/types';
import { getSession } from '@/features/auth/session';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await getSession();
  if (!session?.access_token) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API Error on ${url}:`, response.status, errorBody);
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getSponsorshipDashboardData(): Promise<SponsorshipDashboardData> {
    return fetchWithAuth('/sponsorship/dashboard');
}
