'use server';

export type GeneratePlaygroundChallengeInput = {
  playgroundName: string;
  playgroundType: string;
  topPlayerName: string;
  topPlayerStat: string;
};

export type GeneratePlaygroundChallengeOutput = {
  title: string;
  description: string;
  reward: number;
};

export async function generatePlaygroundChallenge(input: GeneratePlaygroundChallengeInput): Promise<GeneratePlaygroundChallengeOutput> {
  const response = await fetch('/api/ai/generate-playground-challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Backend API error:', errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }
  
  return response.json();
}
