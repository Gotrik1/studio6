"use server";

export type GeneratePlaygroundDrillInput = {
  userWeakness: string;
  playgroundType: string;
};

export type GeneratePlaygroundDrillOutput = {
  title: string;
  description: string;
  reward: number;
};

export async function generatePlaygroundDrill(
  input: GeneratePlaygroundDrillInput,
): Promise<GeneratePlaygroundDrillOutput> {
  const response = await fetch("/api/ai/generate-playground-drill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend API error:", errorBody);
    throw new Error(`Backend API responded with status: ${response.status}`);
  }

  return response.json();
}
