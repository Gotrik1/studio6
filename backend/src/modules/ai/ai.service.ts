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
import { generateSocialMediaPost, type GenerateSocialMediaPostInput, type GenerateSocialMediaPostOutput } from '@/ai/flows/generate-social-media-post-flow';
import { generateSponsorshipPitch, type GenerateSponsorshipPitchInput, type GenerateSponsorshipPitchOutput } from '@/ai/flows/generate-sponsorship-pitch';
import { sponsorshipScout, type SponsorshipScoutOutput } from '@/ai/flows/sponsorship-scout-flow';
import { generatePromotionWizard, type GeneratePromotionWizardInput, type GeneratePromotionWizardOutput } from '@/ai/flows/generate-promotion-wizard-flow';
import { generateTournamentWizard, type GenerateTournamentWizardInput, type GenerateTournamentWizardOutput } from '@/ai/flows/generate-tournament-wizard-flow';
import { aiTeamAssistant, type AiTeamAssistantInput, type AiTeamAssistantOutput } from '@/ai/flows/ai-team-assistant-flow';
import { findSponsorsForTeam, type FindSponsorsForTeamInput, type FindSponsorsForTeamOutput } from '@/ai/flows/find-sponsors-for-team-flow';
import { generatePostImage_Backend, type GeneratePostImageInput, type GeneratePostImageOutput } from '@/ai/flows/generate-post-image-flow';
import { analyzePlaygroundDetails, type AnalyzePlaygroundDetailsInput, type AnalyzePlaygroundDetailsOutput } from '@/ai/flows/analyze-playground-details-flow';
import { analyzePlaygroundReport, type AnalyzePlaygroundReportInput, type AnalyzePlaygroundReportOutput } from '@/ai/flows/analyze-playground-report-flow';
import { smartSearch, type SmartSearchOutput } from '@/ai/flows/smart-search-flow';


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
  
  async generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
    return generateSocialMediaPost(input);
  }
  
  async generateSponsorshipPitch(input: GenerateSponsorshipPitchInput): Promise<GenerateSponsorshipPitchOutput> {
    return generateSponsorshipPitch(input);
  }

  async sponsorshipScout(prompt: string): Promise<SponsorshipScoutOutput> {
    return sponsorshipScout(prompt);
  }

  async generatePromotionWizard(input: GeneratePromotionWizardInput): Promise<GeneratePromotionWizardOutput> {
    return generatePromotionWizard(input);
  }

  async generateTournamentWizard(input: GenerateTournamentWizardInput): Promise<GenerateTournamentWizardOutput> {
    return generateTournamentWizard(input);
  }

  async aiTeamAssistant(input: AiTeamAssistantInput): Promise<AiTeamAssistantOutput> {
    return aiTeamAssistant(input);
  }

  async findSponsorsForTeam(input: FindSponsorsForTeamInput): Promise<FindSponsorsForTeamOutput> {
    return findSponsorsForTeam(input);
  }

  async generatePostImage(prompt: GeneratePostImageInput): Promise<GeneratePostImageOutput> {
    return generatePostImage_Backend(prompt);
  }

  async analyzePlaygroundDetails(input: AnalyzePlaygroundDetailsInput): Promise<AnalyzePlaygroundDetailsOutput> {
    return analyzePlaygroundDetails(input);
  }

  async analyzePlaygroundReport(input: AnalyzePlaygroundReportInput): Promise<AnalyzePlaygroundReportOutput> {
    return analyzePlaygroundReport(input);
  }

  async smartSearch(query: string): Promise<SmartSearchOutput> {
    return smartSearch(query);
  }
}
