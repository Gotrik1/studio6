import { Injectable } from '@nestjs/common';
import { generateTeamConcept } from '../../ai/flows/generate-team-concept-flow';
import type { GenerateTeamConceptOutput } from '../../ai/flows/schemas/generate-team-concept-schema';

@Injectable()
export class AiService {
  async generateTeamConcept(prompt: string): Promise<GenerateTeamConceptOutput> {
    // In a real application, you might add more logic here,
    // like checking user permissions, logging, etc.
    return generateTeamConcept({ prompt });
  }
}
