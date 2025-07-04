import type { z } from 'zod';
import type { AnalyzePlayerPerformanceInputSchema } from '@/ai/flows/schemas/analyze-player-performance-schema';

export class AnalyzePlayerPerformanceDto implements z.infer<typeof AnalyzePlayerPerformanceInputSchema> {
    readonly trainingSummary: string;
    readonly recentWorkouts: string;
}
