
'use server';

// Define types locally to decouple from backend schemas.
export type LfgLobby = {
  id: string;
  type: 'GAME' | 'TRAINING';
  sport: string;
  location: string;
  playgroundId?: string;
  startTime: Date;
  endTime: Date;
  playersNeeded: number;
  playersJoined: number;
  comment: string;
  creator: {
    name: string;
    avatar: string;
  };
};

export type FindLfgLobbiesInput = string;
export type FindLfgLobbiesOutput = {
    recommendations: LfgLobby[];
};


export async function findLfgLobbies(input: FindLfgLobbiesInput): Promise<FindLfgLobbiesOutput> {
  const response = await fetch('/api/ai/find-lfg-lobbies', {
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
