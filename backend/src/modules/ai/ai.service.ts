import { Injectable } from '@nestjs/common';
import { generateTeamConcept } from '../../ai/flows/generate-team-concept-flow';
import type { GenerateTeamConceptOutput } from '../../ai/flows/schemas/generate-team-concept-schema';
import { generateUserAvatar } from '../../ai/flows/generate-user-avatar-flow';
import type { GenerateUserAvatarOutput } from '../../ai/flows/schemas/generate-user-avatar-schema';
import { generatePlatformNewsWithAudio } from '../../ai/flows/generate-platform-news-flow';
import type { NewsWithAudio } from '../../ai/flows/schemas/generate-platform-news-schema';
import { analyzeJoinRequest, type AnalyzeJoinRequestInput, type AnalyzeJoinRequestOutput } from '@/ai/flows/analyze-join-request-flow';
import { analyzeTeamPerformance, type AnalyzeTeamPerformanceInput, type AnalyzeTeamPerformanceOutput } from '@/ai/flows/analyze-team-performance-flow';


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

  async analyzeJoinRequest(input: AnalyzeJoinRequestInput): Promise<AnalyzeJoinRequestOutput> {
    return analyzeJoinRequest(input);
  }

  async analyzeTeamPerformance(input: AnalyzeTeamPerformanceInput): Promise<AnalyzeTeamPerformanceOutput> {
    return analyzeTeamPerformance(input);
  }
}
