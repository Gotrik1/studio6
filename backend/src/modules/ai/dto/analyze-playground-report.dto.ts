import type { z } from 'zod';
import type { AnalyzePlaygroundReportInputSchema } from '@/ai/flows/schemas/analyze-playground-report-schema';

export class AnalyzePlaygroundReportDto implements z.infer<typeof AnalyzePlaygroundReportInputSchema> {
    readonly playgroundName: string;
    readonly issueCategory: string;
    readonly userComment: string;
}
