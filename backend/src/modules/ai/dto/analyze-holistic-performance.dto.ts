import type { z } from 'zod';
import type { AnalyzeHolisticPerformanceInputSchema } from '@/ai/flows/schemas/analyze-holistic-performance-schema';

export class AnalyzeHolisticPerformanceDto implements z.infer<typeof AnalyzeHolisticPerformanceInputSchema> {
    readonly physicalSummary: string;
    readonly esportsSummary: string;
}
