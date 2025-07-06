
'use server';

// Define types locally
export type GenerateDialogueInput = string;

export type GenerateDialogueOutput = {
  dialogue: string;
};


export async function generateDialogue(topic: GenerateDialogueInput): Promise<GenerateDialogueOutput> {
  const response = await fetch('/api/ai/generate-dialogue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
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
