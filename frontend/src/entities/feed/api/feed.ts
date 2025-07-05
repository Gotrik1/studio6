'use server';

import { fetchWithAuth } from "@/shared/lib/api-client";
import type { Activity } from "../model/types";
import { revalidateTag } from "next/cache";

export type { Activity };

export async function getFeed(): Promise<Activity[]> {
    const result = await fetchWithAuth('/feed', {
        next: {
            tags: ['feed']
        }
    });
    if (!result.success || !Array.isArray(result.data)) {
        console.error("Failed to fetch feed", result.error);
        return [];
    }
    
    // Adapter to convert ID to string
    return result.data.map((item: any) => ({
        ...item,
        id: String(item.id),
    }));
}

export async function postStatus(text: string) {
    const result = await fetchWithAuth('/activities/status', {
        method: 'POST',
        body: JSON.stringify({ text }),
    });
    
    if (result.success) {
        revalidateTag('feed');
    }

    return result;
}
