
'use server';

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from '@/shared/lib/api-client';

export type Friend = {
    id: string;
    name: string;
    avatar: string;
    avatarHint: string;
    status: string;
};

export type FriendRequest = {
    id: string;
    name: string;
    avatar: string;
    avatarHint: string;
    mutualFriends: number;
};

export type FriendSuggestion = {
    id: string;
    name: string;
    avatar: string;
    avatarHint: string;
    reason: string;
};

export async function getFriends(): Promise<Friend[]> {
    const result = await fetchWithAuth<Friend[]>('/friends');
    if (!result.success) return [];
    return result.data;
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
     const result = await fetchWithAuth<FriendRequest[]>('/friends/requests');
    if (!result.success) return [];
    return result.data;
}

export async function getFriendSuggestions(): Promise<FriendSuggestion[]> {
    const result = await fetchWithAuth<FriendSuggestion[]>('/friends/suggestions');
    if (!result.success) return [];
    return result.data;
}

export async function sendFriendRequest(toId: string) {
    const result = await fetchWithAuth(`/friends/requests`, {
        method: 'POST',
        body: JSON.stringify({ toId }),
    });
    if (!result.success) throw new Error(result.error);
    revalidatePath('/friends');
}

export async function addSuggestedFriend(suggestionId: string) {
    await sendFriendRequest(suggestionId);
}

export async function acceptFriendRequest(requestId: string) {
    const result = await fetchWithAuth(`/friends/requests/${requestId}/accept`, { method: 'POST' });
    if (!result.success) throw new Error(result.error);
    revalidatePath('/friends');
}

export async function declineFriendRequest(requestId: string) {
    const result = await fetchWithAuth(`/friends/requests/${requestId}`, { method: 'DELETE' });
    if (!result.success) throw new Error(result.error);
    revalidatePath('/friends');
}

export async function removeFriend(friendId: string) {
    const result = await fetchWithAuth(`/friends/${friendId}`, { method: 'DELETE' });
    if (!result.success) throw new Error(result.error);
    revalidatePath('/friends');
}
