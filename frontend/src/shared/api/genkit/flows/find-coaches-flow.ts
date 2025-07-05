'use server';

// Define types locally
export type Coach = {
    id: string;
    name: string;
    avatar: string | null;
    avatarHint: string;
    specialization: string;
    description: string;
    tags: string[];
    rating: number;
    price: string;
    profileUrl: string;
};

export type FindCoachesInput = string;

export type FindCoachesOutput = {
    recommendations: {
        coach: Coach;
        reasoning: string;
    }[];
};


export async function findCoaches(input: FindCoachesInput): Promise<FindCoachesOutput> {
  const response = await fetch('/api/ai/find-coaches', {
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
