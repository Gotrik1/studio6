"use server";

// Define types locally
export type SupportChatbotInput = string;
export type SupportChatbotOutput = {
  answer: string;
};

export async function askSupportChatbot(
  query: SupportChatbotInput,
): Promise<SupportChatbotOutput> {
  const response = await fetch("/api/ai/support-chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
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
