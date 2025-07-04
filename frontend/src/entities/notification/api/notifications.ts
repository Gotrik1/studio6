'use server';

import { getSession } from "@/features/auth/session";
import { revalidateTag } from "next/cache";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const session = await getSession();
    if (!session?.access_token) {
        // Return empty array instead of throwing for unauthorized, 
        // as this might be called on the client before session is fully hydrated.
        console.warn('Unauthorized notification fetch attempt');
        return [];
    }

    try {
        const response = await fetch(`${process.env.BACKEND_URL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            next: { tags: ['notifications'] },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API Error on ${url}:`, response.status, errorBody);
            // Gracefully handle error
            return [];
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error(`Network error on ${url}:`, error);
        return [];
    }
}

export type Notification = {
    id: string;
    message: string;
    href: string | null;
    isRead: boolean;
    createdAt: string;
    type: string;
}

export async function getNotifications(): Promise<Notification[]> {
    const notifications = await fetchWithAuth('/notifications');
    return Array.isArray(notifications) ? notifications : [];
}

export async function markAllNotificationsAsRead() {
    await fetchWithAuth('/notifications/mark-all-read', { method: 'POST' });
    revalidateTag('notifications');
}
