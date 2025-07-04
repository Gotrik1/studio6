'use server';

import type { Coach } from '@/entities/coach/model/types';

export async function getCoaches(): Promise<Coach[]> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/coaches`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch coaches: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return [];
  }
}
