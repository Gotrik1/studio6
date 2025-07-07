

'use server';

import { getSession } from "@/features/auth/session";

export type FetchResult<T> = {
    success: true;
    data: T;
    status: number;
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
  
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!baseUrl) {
    const errorMsg = "Backend URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL in your environment variables.";
    console.error(errorMsg);
    return { success: false, error: errorMsg, status: 500, data: null };
  }

  const response = await fetch(`${baseUrl}${url}`, {
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
    return { success: true, data: null as T, status: response.status };
  }

  const data = await response.json();
  return { success: true, data: data, status: response.status };
}
