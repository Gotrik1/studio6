'use server';

import { fetchWithAuth } from "@/shared/lib/api-client";
import type { Activity } from "../model/types";
import { revalidateTag } from "next/cache";

export async function getFeed(): Promise<Activity[]> {
    const result = await fetchWithAuth('/activities/feed', {
        next: {
            tags: ['feed']
        }
    });
    if (!result.success) {
        console.error("Failed to fetch feed", result.error);
        return [];
    }
    return result.data as Activity[];
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
