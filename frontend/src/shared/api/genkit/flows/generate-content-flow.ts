"use server";

// Define types locally
export type GenerateContentInput = {
  topic: string;
  tone: string;
  contentType: string;
};

export type GenerateContentOutput = {
  generatedText: string;
};

export async function generateContent(
  input: GenerateContentInput,
): Promise<GenerateContentOutput> {
  const response = await fetch("/api/ai/generate-content", {
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
