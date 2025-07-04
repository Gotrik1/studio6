import type { z } from 'zod';
import type { AnalyzeSecurityInputSchema } from '@/ai/flows/schemas/analyze-security-schema';

export class AnalyzeSecurityDto implements z.infer<typeof AnalyzeSecurityInputSchema> {
    readonly activityLog: string;
}
