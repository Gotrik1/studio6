'use server';

// Define types locally to decouple from backend schemas.
export type AnalyzeReportInput = {
  reportReason: string;
  evidenceContext: string;
  reportedUserActivity: string;
};

export type AnalyzeReportOutput = {
  recommendation: 'warning' | 'temp_ban' | 'perm_ban' | 'no_action';
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
};

export async function analyzeReport(input: AnalyzeReportInput): Promise<AnalyzeReportOutput> {
  const response = await fetch('/api/ai/analyze-report', {
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

  return response.json();
}
