'use server';

export type GeneratePlaygroundSummaryInput = {
  name: string;
  address: string;
  surface: string;
  features: string[];
};

export type GeneratePlaygroundSummaryOutput = {
  summary: string;
};

export async function generatePlaygroundSummary(input: GeneratePlaygroundSummaryInput): Promise<GeneratePlaygroundSummaryOutput> {
  const response = await fetch('/api/ai/generate-playground-summary', {
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
