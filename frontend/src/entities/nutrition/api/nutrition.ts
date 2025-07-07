
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

export async function getFoodItems() {
  const result = await fetchWithAuth('/nutrition/food-items');
  if (!result.success) {
    console.error('Failed to fetch food items:', result.error);
    return [];
  }
  return result.data;
}

export async function getFoodLog() {
    const result = await fetchWithAuth('/nutrition/log');
     if (!result.success) {
        console.error('Failed to fetch food log:', result.error);
        return [];
    }
    return result.data;
}

export async function addFoodLog(data: { foodItemId: string; grams: number; meal: string }) {
    const result = await fetchWithAuth('/nutrition/log', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    
    // In a real app, revalidation would be better, but for now we refetch in provider
    
    return result;
}

export async function deleteFoodLog(id: string) {
    const result = await fetchWithAuth(`/nutrition/log/${id}`, {
        method: 'DELETE',
    });
    
    return result;
}
