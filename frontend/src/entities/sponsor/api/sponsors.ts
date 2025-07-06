'use server';

import type { Sponsor } from '@/entities/sponsor/model/types';

export async function getSponsors(): Promise<Sponsor[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sponsors`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch sponsors');
    }
    return res.json();
}
