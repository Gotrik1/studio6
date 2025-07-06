
'use server';

// Define types locally
export type CreateTeamInput = {
  description: string;
};

export type CreateTeamOutput = {
  name: string;
  motto: string;
};

export async function createTeam(input: CreateTeamInput): Promise<CreateTeamOutput> {
  const response = await fetch('/api/ai/create-team', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
