'use server';

import type { User } from '@/shared/lib/types';
import { getSession } from '@/features/auth/session';

export async function getUsers(): Promise<User[]> {
    const session = await getSession();
    // In a real app with RBAC, we'd check if session.user.role is 'admin'
    if (!session?.access_token) {
        throw new Error('Unauthorized');
    }

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
            },
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error('Failed to fetch users:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}
