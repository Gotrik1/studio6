import { Injectable } from '@nestjs/common';
import { createTeam } from '../../ai/flows/create-team-flow';
import type { CreateTeamOutput } from '../../ai/flows/schemas/create-team-schema';

@Injectable()
export class AiService {
  async generateTeamConcept(prompt: string): Promise<CreateTeamOutput> {
    // In a real application, you might add more logic here,
    // like checking user permissions, logging, etc.
    return createTeam({ description: prompt });
  }
}
