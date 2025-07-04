import type { z } from 'zod';
import type { GenerateDashboardTipInputSchema } from '@/ai/flows/schemas/generate-dashboard-tip-schema';

export class GenerateDashboardTipDto implements z.infer<typeof GenerateDashboardTipInputSchema> {
    readonly userName: string;
    readonly lastActivity: string;
}
