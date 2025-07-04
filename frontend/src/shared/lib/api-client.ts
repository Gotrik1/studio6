'use server';

import { getSession } from "@/features/auth/session";

type FetchResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
    status: number;
    data: null;
};

export async function fetchWithAuth<T = any>(url: string, options: RequestInit = {}): Promise<FetchResult<T>> {
  const session = await getSession();
  if (!session?.access_token) {
    return { success: false, error: 'Unauthorized', status: 401, data: null };
  }

  const response = await fetch(`${process.env.BACKEND_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    console.error(`API Error on ${url}:`, response.status, errorBody);
    return { success: false, error: errorBody.message || `API request failed with status ${response.status}`, status: response.status, data: null };
  }
  
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return { success: true, data: null as T };
  }

  return { success: true, data: await response.json() };
}
