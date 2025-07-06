import type { z } from "zod";
import type { GenerateMatchCommentaryInputSchema } from "@/ai/flows/schemas/generate-match-commentary-schema";

export class GenerateMatchCommentaryDto
  implements z.infer<typeof GenerateMatchCommentaryInputSchema>
{
  readonly team1Name: string;
  readonly team2Name: string;
  readonly events: {
    time: string;
    event: string;
    player: string;
    team: string;
  }[];
}
