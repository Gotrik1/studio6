import type { z } from 'zod';
import type { GenerateTournamentWizardInputSchema } from '@/ai/flows/schemas/generate-tournament-wizard-schema';

export class GenerateTournamentWizardDto implements z.infer<typeof GenerateTournamentWizardInputSchema> {
    readonly prompt: string;
}
