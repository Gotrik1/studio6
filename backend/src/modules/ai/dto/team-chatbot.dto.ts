import type { z } from "zod";
import type { TeamChatbotInputSchema } from "@/ai/flows/schemas/team-chatbot-schema";

export class TeamChatbotDto implements z.infer<typeof TeamChatbotInputSchema> {
  readonly teamId: string;
  readonly query: string;
}
