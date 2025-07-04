'use server';

type Event = {
    time: string;
    event: string;
    player: string;
    team: string;
};

export type GenerateMatchCommentaryInput = {
  team1Name: string;
  team2Name: string;
  events: Event[];
};

export type GenerateMatchCommentaryOutput = {
  commentaryScript: string;
};

export async function generateMatchCommentary(input: GenerateMatchCommentaryInput): Promise<GenerateMatchCommentaryOutput & { audioDataUri: string }> {
  const response = await fetch('/api/ai/generate-match-commentary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
