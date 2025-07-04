'use server';

// Local types to avoid direct dependency on backend schemas
export type AnalyzeHolisticPerformanceInput = {
  physicalSummary: string;
  esportsSummary: string;
};

export type AnalyzeHolisticPerformanceOutput = {
  overallAssessment: string;
  correlations: {
    observation: string;
    explanation: string;
  }[];
  recommendations: string[];
};

export async function analyzeHolisticPerformance(input: AnalyzeHolisticPerformanceInput): Promise<AnalyzeHolisticPerformanceOutput> {
  const response = await fetch('/api/ai/analyze-holistic-performance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
