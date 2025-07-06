
'use server';

// Define types locally
export type TeamChatbotInput = {
  teamId: string;
  query: string;
};
export type TeamChatbotOutput = string;

export async function askTeamChatbot(input: TeamChatbotInput): Promise<TeamChatbotOutput> {
    const response = await fetch('/api/ai/team-chatbot', {
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
