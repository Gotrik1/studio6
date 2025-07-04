'use server';

// Define types locally to decouple from backend schemas.
export type Playground = {
  id: string;
  name: string;
  address: string;
  type: string;
  coverImage: string;
  coverImageHint: string;
  surface: string;
  features: string[];
  rating: number;
};

export type FindVenuesInput = {
  query: string;
};

export type FindVenuesOutput = {
  summary: string;
  suggestedVenues: Playground[];
};


export async function findVenues(input: FindVenuesInput): Promise<FindVenuesOutput> {
  const response = await fetch('/api/ai/find-venues', {
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
