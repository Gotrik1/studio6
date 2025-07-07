
'use server';

import { fetchWithAuth } from '@/shared/lib/api-client';

export type AdminDashboardStats = {
    totalUsers: number;
    activeTournaments: number;
    openTickets: number;
    monthlyRevenue: string;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats | null> {
    const result = await fetchWithAuth<AdminDashboardStats>('/admin/dashboard-stats');
    if (!result.success) {
        console.error("Failed to fetch admin dashboard stats:", result.error);
        return null;
    }
    return result.data;
}
