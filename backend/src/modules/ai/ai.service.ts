import { Injectable } from '@nestjs/common';
import { generateTeamConcept } from '../../ai/flows/generate-team-concept-flow';
import type { GenerateTeamConceptOutput } from '../../ai/flows/schemas/generate-team-concept-schema';
import { generateUserAvatar } from '../../ai/flows/generate-user-avatar-flow';
import type { GenerateUserAvatarOutput } from '../../ai/flows/schemas/generate-user-avatar-schema';
import { generatePlatformNewsWithAudio } from '../../ai/flows/generate-platform-news-flow';
import type { NewsWithAudio } from '../../ai/flows/schemas/generate-platform-news-schema';


@Injectable()
export class AiService {
  async generateTeamConcept(prompt: string): Promise<GenerateTeamConceptOutput> {
    return generateTeamConcept({ prompt });
  }

  async generateUserAvatar(prompt: string): Promise<GenerateUserAvatarOutput> {
    return generateUserAvatar({ prompt });
  }

  async generateDashboardNews(): Promise<NewsWithAudio> {
      return generatePlatformNewsWithAudio();
  }
}
