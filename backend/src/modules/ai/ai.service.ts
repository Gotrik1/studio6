import { Injectable } from '@nestjs/common';
import { generateTeamConcept } from '../../ai/flows/generate-team-concept-flow';
import type { GenerateTeamConceptOutput } from '../../ai/flows/schemas/generate-team-concept-schema';
import { generateUserAvatar } from '../../ai/flows/generate-user-avatar-flow';
import type { GenerateUserAvatarOutput } from '../../ai/flows/schemas/generate-user-avatar-schema';
import { generateProfileBanner } from '../../ai/flows/generate-profile-banner-flow';
import type { GenerateProfileBannerOutput } from '../../ai/flows/schemas/generate-profile-banner-schema';
import { generatePlatformNewsWithAudio } from '../../ai/flows/generate-platform-news-flow';
import type { NewsWithAudio } from '../../ai/flows/schemas/generate-platform-news-schema';
import { analyzeJoinRequest, type AnalyzeJoinRequestInput, type AnalyzeJoinRequestOutput } from '@/ai/flows/analyze-join-request-flow';
import { analyzeTeamPerformance, type AnalyzeTeamPerformanceInput, type AnalyzeTeamPerformanceOutput } from '@/ai/flows/analyze-team-performance-flow';
import { analyzeEsportsPerformance, type AnalyzeEsportsPerformanceInput, type AnalyzeEsportsPerformanceOutput } from '@/ai/flows/analyze-esports-performance-flow';
import { analyzeContent, type AnalyzeContentInput, type AnalyzeContentOutput } from '@/ai/flows/analyze-content-generation-flow';
import { generateContent, type GenerateContentInput, type GenerateContentOutput } from '@/ai/flows/generate-content-flow';
import { generateDialogue, type GenerateDialogueInput, type GenerateDialogueOutput } from '@/ai/flows/dialogue-generation-flow';
import { multiSpeakerTts, type MultiSpeakerTtsInput, type MultiSpeakerTtsOutput } from '@/ai/flows/multi-speaker-tts-flow';
import { analyzeDispute, type AnalyzeDisputeInput, type AnalyzeDisputeOutput } from '@/ai/flows/analyze-dispute-flow';
import { textToSpeech, type TextToSpeechInput, type TextToSpeechOutput } from '@/ai/flows/tts-flow';
import { analyzeSecurity, type AnalyzeSecurityInput, type AnalyzeSecurityOutput } from '@/ai/flows/analyze-security-flow';


@Injectable()
export class AiService {
  async generateTeamConcept(prompt: string): Promise<GenerateTeamConceptOutput> {
    return generateTeamConcept({ prompt });
  }

  async generateUserAvatar(prompt: string): Promise<GenerateUserAvatarOutput> {
    return generateUserAvatar({ prompt });
  }

  async generateProfileBanner(prompt: string): Promise<GenerateProfileBannerOutput> {
    return generateProfileBanner({ prompt });
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

  async analyzeEsportsPerformance(input: AnalyzeEsportsPerformanceInput): Promise<AnalyzeEsportsPerformanceOutput> {
    return analyzeEsportsPerformance(input);
  }

  async analyzeContent(input: AnalyzeContentInput): Promise<AnalyzeContentOutput> {
    return analyzeContent(input);
  }

  async generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
    return generateContent(input);
  }

  async generateDialogue(topic: GenerateDialogueInput): Promise<GenerateDialogueOutput> {
    return generateDialogue(topic);
  }

  async multiSpeakerTts(script: MultiSpeakerTtsInput): Promise<MultiSpeakerTtsOutput> {
    return multiSpeakerTts(script);
  }

  async analyzeDispute(input: AnalyzeDisputeInput): Promise<AnalyzeDisputeOutput> {
    return analyzeDispute(input);
  }

  async textToSpeech(text: TextToSpeechInput): Promise<TextToSpeechOutput> {
    return textToSpeech(text);
  }

  async analyzeSecurity(input: AnalyzeSecurityInput): Promise<AnalyzeSecurityOutput> {
    return analyzeSecurity(input);
  }
}
