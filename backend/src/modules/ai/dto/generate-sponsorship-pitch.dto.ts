import type { z } from 'zod';
import type { GenerateSponsorshipPitchInputSchema } from '@/ai/flows/schemas/generate-sponsorship-pitch-schema';

export class GenerateSponsorshipPitchDto implements z.infer<typeof GenerateSponsorshipPitchInputSchema> {
    readonly teamName: string;
    readonly achievements: string;
    readonly goals: string;
    readonly audience: string;
}
