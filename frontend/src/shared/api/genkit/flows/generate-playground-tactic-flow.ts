'use server';

export type GeneratePlaygroundTacticInput = {
  playgroundType: string;
  playgroundFeatures: string[];
  teamPlaystyle: string;
};

export type GeneratePlaygroundTacticOutput = {
  tacticName: string;
  tacticDescription: string;
  keyPoints: string[];
};

export async function generatePlaygroundTactic(input: GeneratePlaygroundTacticInput): Promise<GeneratePlaygroundTacticOutput> {
  const response = await fetch('/api/ai/generate-playground-tactic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
