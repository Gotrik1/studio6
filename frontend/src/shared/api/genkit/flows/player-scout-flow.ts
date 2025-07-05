'use server';

// Define types locally to decouple from the backend schema.
// This establishes a clear API contract for the frontend.
export type PlayerProfile = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  profileUrl: string;
  statsSummary: string;
};

export type PlayerScoutInput = string;

export type PlayerScoutOutput = {
  recommendations: {
    player: PlayerProfile;
    reasoning: string;
  }[];
};

export async function playerScout(input: PlayerScoutInput): Promise<PlayerScoutOutput> {
  const response = await fetch('/api/ai/player-scout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
