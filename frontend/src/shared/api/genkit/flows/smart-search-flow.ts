"use server";

// These types are now defined locally as the schema file is removed from the frontend.
export type User = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  profileUrl: string;
};

export type Team = {
  name: string;
  motto: string;
  logo: string;
  dataAiHint: string;
  rank: number;
  members: number;
  slug: string;
  game: string;
};

export type Tournament = {
  name: string;
  game: string;
  status: string;
  image: string;
  dataAiHint: string;
  slug: string;
};

export type SmartSearchInput = string;

export type SmartSearchOutput = {
  users: User[];
  teams: Team[];
  tournaments: Tournament[];
};

export async function smartSearch(
  query: SmartSearchInput,
): Promise<SmartSearchOutput> {
  const response = await fetch("/api/ai/smart-search", {
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
