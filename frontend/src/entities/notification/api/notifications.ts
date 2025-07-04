'use server';

import { revalidateTag } from "next/cache";
import { fetchWithAuth } from '@/shared/lib/api-client';

export type Notification = {
    id: string;
    message: string;
    href: string | null;
    isRead: boolean;
    createdAt: string;
    type: string;
}

export async function getNotifications(): Promise<Notification[]> {
    const result = await fetchWithAuth('/notifications');
    if (!result.success) return [];
    return Array.isArray(result.data) ? result.data : [];
}

export async function markAllNotificationsAsRead() {
    await fetchWithAuth('/notifications/mark-all-read', { method: 'POST' });
    revalidateTag('notifications');
}
