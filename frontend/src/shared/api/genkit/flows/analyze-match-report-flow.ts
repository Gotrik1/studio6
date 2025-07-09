"use server";

type Player = {
  name: string;
  role: string;
  avatar: string;
  avatarHint?: string;
};

type Event = {
  time: string;
  event: string;
  player: string;
  team: string;
};

export type AnalyzeMatchReportInput = {
  team1Name: string;
  team2Name: string;
  score: string;
  tournament: string;
  events: Event[];
  lineupTeam1: Player[];
  lineupTeam2: Player[];
};

export type AnalyzeMatchReportOutput = {
  summary: string;
  keyMoment: string;
  mvp: {
    name: string;
    reason: string;
  };
  team1Advice: string;
  team2Advice: string;
};

export async function analyzeMatchReport(
  input: AnalyzeMatchReportInput,
): Promise<AnalyzeMatchReportOutput> {
  const response = await fetch("/api/ai/analyze-match-report", {
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
