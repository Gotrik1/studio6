import type { z } from "zod";
import type { OnboardingInputSchema } from "@/ai/flows/schemas/onboarding-assistant-schema";

export class OnboardingAssistantDto
  implements z.infer<typeof OnboardingInputSchema>
{
  readonly userName: string;
  readonly userRole: string;
}
