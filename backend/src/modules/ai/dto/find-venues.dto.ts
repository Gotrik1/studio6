import type { z } from "zod";
import type { FindVenuesInputSchema } from "@/ai/flows/schemas/find-venues-schema";

export class FindVenuesDto implements z.infer<typeof FindVenuesInputSchema> {
  readonly query: string;
}
