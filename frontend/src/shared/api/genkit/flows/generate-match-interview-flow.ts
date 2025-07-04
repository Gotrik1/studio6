'use server';

export type GenerateMatchInterviewInput = {
  matchSummary: string;
  mvpName: string;
};

export type GenerateMatchInterviewOutput = {
  audioDataUri: string;
  script: string;
};


export async function generateMatchInterview(input: GenerateMatchInterviewInput): Promise<GenerateMatchInterviewOutput> {
  const response = await fetch('/api/ai/generate-match-interview', {
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
