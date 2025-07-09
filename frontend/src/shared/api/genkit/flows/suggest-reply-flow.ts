"use server";

// Define types locally since the schema file will be removed from the frontend.
export type SuggestReplyInput = {
  history: string;
  teamId?: string;
};

export type SuggestReplyOutput = {
  suggestions: string[];
};

export async function suggestReply(
  input: SuggestReplyInput,
): Promise<SuggestReplyOutput> {
  const response = await fetch("/api/ai/suggest-reply", {
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
