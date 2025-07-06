import type { z } from "zod";
import type { SuggestReplyInputSchema } from "@/ai/flows/schemas/suggest-reply-schema";

export class SuggestReplyDto
  implements z.infer<typeof SuggestReplyInputSchema>
{
  readonly history: string;
  readonly teamId?: string;
}
