"use server";

// Define types locally
export type MultiSpeakerTtsInput = string;

export type MultiSpeakerTtsOutput = {
  audioDataUri: string;
};

export async function multiSpeakerTts(
  script: MultiSpeakerTtsInput,
): Promise<MultiSpeakerTtsOutput> {
  const response = await fetch("/api/ai/multi-speaker-tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ script }),
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
