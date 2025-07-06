'use server';

export type GeneratePlaygroundLoreInput = {
  playgroundName: string;
  topPlayer: string;
  topTeam: string;
  checkIns: number;
};

export type GeneratePlaygroundLoreOutput = {
  lore: string;
};

export async function generatePlaygroundLore(input: GeneratePlaygroundLoreInput): Promise<GeneratePlaygroundLoreOutput> {
  const response = await fetch('/api/ai/generate-playground-lore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Backend API error on generatePlaygroundLore: ${errorText}`);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }
  
  return response.json();
}
