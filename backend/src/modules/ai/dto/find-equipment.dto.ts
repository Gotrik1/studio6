import type { z } from 'zod';
import type { FindEquipmentInputSchema } from '@/ai/flows/schemas/find-equipment-schema';

export class FindEquipmentDto {
    readonly input: z.infer<typeof FindEquipmentInputSchema>;
}
