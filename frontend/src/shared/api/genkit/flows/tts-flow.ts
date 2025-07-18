"use server";

// Define types locally
export type TextToSpeechInput = string;
export type TextToSpeechOutput = {
  audioDataUri: string;
};

export async function textToSpeech(
  text: TextToSpeechInput,
): Promise<TextToSpeechOutput> {
  const response = await fetch("/api/ai/text-to-speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
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
