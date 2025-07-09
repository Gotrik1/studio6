"use server";

// Define types locally
export type GeneratePromotionDetailsInput = {
  prompt: string;
};

export type GeneratePromotionDetailsOutput = {
  name: string;
  description: string;
  prize: string;
};

export async function generatePromotionDetails(
  input: GeneratePromotionDetailsInput,
): Promise<GeneratePromotionDetailsOutput> {
  const response = await fetch("/api/ai/generate-promotion-details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
