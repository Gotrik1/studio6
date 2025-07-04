'use server';

import { revalidatePath } from "next/cache";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const { getSession } = await import('@/features/auth/session');
    const session = await getSession();
    if (!session?.access_token) {
        throw new Error('Unauthorized');
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
        const errorBody = await response.text();
        console.error(`API Error on ${url}:`, response.status, errorBody);
        throw new Error(`API request failed with status ${response.status}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    return response.json();
}

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
    return fetchWithAuth('/friends');
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
    return fetchWithAuth('/friends/requests');
}

export async function getFriendSuggestions(): Promise<FriendSuggestion[]> {
    return fetchWithAuth('/friends/suggestions');
}

export async function sendFriendRequest(toId: string) {
    await fetchWithAuth(`/friends/requests`, {
        method: 'POST',
        body: JSON.stringify({ toId }),
    });
    revalidatePath('/friends');
}

export async function addSuggestedFriend(suggestionId: string) {
    // The suggestionId is the userId of the suggested friend.
    await sendFriendRequest(suggestionId);
}

export async function acceptFriendRequest(requestId: string) {
    await fetchWithAuth(`/friends/requests/${requestId}/accept`, { method: 'POST' });
    revalidatePath('/friends');
}

export async function declineFriendRequest(requestId: string) {
    await fetchWithAuth(`/friends/requests/${requestId}`, { method: 'DELETE' });
    revalidatePath('/friends');
}

export async function removeFriend(friendId: string) {
    await fetchWithAuth(`/friends/${friendId}`, { method: 'DELETE' });
    revalidatePath('/friends');
}
