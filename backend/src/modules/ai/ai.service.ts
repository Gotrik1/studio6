
import { Injectable } from "@nestjs/common";
import {
  generateTeamConcept,
  type GenerateTeamConceptOutput,
} from "../../ai/flows/generate-team-concept-flow";
import {
  generateUserAvatar,
  type GenerateUserAvatarOutput,
} from "../../ai/flows/generate-user-avatar-flow";
import {
  generateProfileBanner,
  type GenerateProfileBannerOutput,
} from "../../ai/flows/generate-profile-banner-flow";
import { generatePlatformNewsWithAudio } from "../../ai/flows/generate-platform-news-flow";
import type { NewsWithAudio } from "../../ai/flows/schemas/generate-platform-news-schema";
import {
  analyzeJoinRequest,
  type AnalyzeJoinRequestInput,
  type AnalyzeJoinRequestOutput,
} from "@/ai/flows/analyze-join-request-flow";
import {
  analyzeTeamPerformance,
  type AnalyzeTeamPerformanceInput,
  type AnalyzeTeamPerformanceOutput,
} from "@/ai/flows/analyze-team-performance-flow";
import {
  analyzeEsportsPerformance,
  type AnalyzeEsportsPerformanceInput,
  type AnalyzeEsportsPerformanceOutput,
} from "@/ai/flows/analyze-esports-performance-flow";
import {
  analyzeContent,
  type AnalyzeContentInput,
  type AnalyzeContentOutput,
} from "@/ai/flows/analyze-content-generation-flow";
import {
  generateContent,
  type GenerateContentInput,
  type GenerateContentOutput,
} from "@/ai/flows/generate-content-flow";
import {
  generateDialogue,
  type GenerateDialogueInput,
  type GenerateDialogueOutput,
} from "@/ai/flows/dialogue-generation-flow";
import {
  multiSpeakerTts,
  type MultiSpeakerTtsInput,
  type MultiSpeakerTtsOutput,
} from "@/ai/flows/multi-speaker-tts-flow";
import {
  textToSpeech,
  type TextToSpeechInput,
  type TextToSpeechOutput,
} from "@/ai/flows/tts-flow";
import {
  analyzeSecurity,
  type AnalyzeSecurityInput,
  type AnalyzeSecurityOutput,
} from "@/ai/flows/analyze-security-flow";
import {
  generateSocialMediaPost,
  type GenerateSocialMediaPostInput,
  type GenerateSocialMediaPostOutput,
} from "@/ai/flows/generate-social-media-post-flow";
import {
  generateSponsorshipPitch,
  type GenerateSponsorshipPitchInput,
  type GenerateSponsorshipPitchOutput,
} from "@/ai/flows/generate-sponsorship-pitch";
import {
  generatePromotionWizard,
  type GeneratePromotionWizardInput,
  type GeneratePromotionWizardOutput,
} from "@/ai/flows/generate-promotion-wizard-flow";
import {
  generateTournamentWizard,
  type GenerateTournamentWizardInput,
  type GenerateTournamentWizardOutput,
} from "@/ai/flows/generate-tournament-wizard-flow";
import {
  aiTeamAssistant,
  type AiTeamAssistantInput,
  type AiTeamAssistantOutput,
} from "@/ai/flows/ai-team-assistant-flow";
import {
  findSponsorsForTeam,
  type FindSponsorsForTeamInput,
  type FindSponsorsForTeamOutput,
} from "@/ai/flows/find-sponsors-for-team-flow";
import {
  generatePostImage_Backend,
  type GeneratePostImageInput,
  type GeneratePostImageOutput,
} from "@/ai/flows/generate-post-image-flow";
import {
  analyzePlaygroundDetails,
  type AnalyzePlaygroundDetailsInput,
  type AnalyzePlaygroundDetailsOutput,
} from "@/ai/flows/analyze-playground-details-flow";
import {
  analyzePlaygroundReport,
  type AnalyzePlaygroundReportInput,
  type AnalyzePlaygroundReportOutput,
} from "@/ai/flows/analyze-playground-report-flow";
import {
  generatePlaygroundSummary,
  type GeneratePlaygroundSummaryInput,
  type GeneratePlaygroundSummaryOutput,
} from "@/ai/flows/generate-playground-summary-flow";
import {
  generatePlaygroundTactic,
  type GeneratePlaygroundTacticInput,
  type GeneratePlaygroundTacticOutput,
} from "@/ai/flows/generate-playground-tactic-flow";
import {
  smartSearch,
  type SmartSearchOutput,
  type SmartSearchInput,
} from "@/ai/flows/smart-search-flow";
import {
  analyzePlayerPerformance,
  type AnalyzePlayerPerformanceInput,
  type AnalyzePlayerPerformanceOutput,
} from "@/ai/flows/analyze-player-performance-flow";
import {
  generateTrainingPlan,
  type GenerateTrainingPlanInput,
  type GenerateTrainingPlanOutput,
} from "@/ai/flows/generate-training-plan-flow";
import {
  generatePlaygroundWorkout,
  type GeneratePlaygroundWorkoutInput,
  type GeneratePlaygroundWorkoutOutput,
} from "@/ai/flows/generate-playground-workout-flow";
import {
  generatePlaygroundLore,
  type GeneratePlaygroundLoreInput,
  type GeneratePlaygroundLoreOutput,
} from "@/ai/flows/generate-playground-lore";
import {
  generatePlaygroundDrill,
  type GeneratePlaygroundDrillInput,
  type GeneratePlaygroundDrillOutput,
} from "@/ai/flows/generate-playground-drill-flow";
import {
  analyzeMatchReport,
  type AnalyzeMatchReportInput,
  type AnalyzeMatchReportOutput,
} from "@/ai/flows/analyze-match-report-flow";
import {
  generateMatchCommentary,
  type GenerateMatchCommentaryInput,
} from "@/ai/flows/generate-match-commentary-flow";
import type { GenerateMatchCommentaryOutput } from "@/ai/flows/generate-match-commentary-flow";
import {
  generateMatchInterview,
  type GenerateMatchInterviewInput,
  type GenerateMatchInterviewOutput,
} from "@/ai/flows/generate-match-interview-flow";
import {
  analyzeHolisticPerformance,
  type AnalyzeHolisticPerformanceInput,
  type AnalyzeHolisticPerformanceOutput,
} from "@/ai/flows/analyze-holistic-performance-flow";
import {
  suggestReply,
  type SuggestReplyInput,
  type SuggestReplyOutput,
} from "@/ai/flows/suggest-reply-flow";
import {
  askSupportChatbot,
  type SupportChatbotInput,
  type SupportChatbotOutput,
} from "@/ai/flows/support-chatbot-flow";
import {
  createTeam,
  type CreateTeamInput,
  type CreateTeamOutput,
} from "@/ai/flows/create-team-flow";
import {
  generateTeamAvatar,
  type GenerateTeamAvatarOutput,
} from "@/ai/flows/generate-team-avatar-flow";
import {
  generatePromotionDetails,
  type GeneratePromotionDetailsInput,
  type GeneratePromotionDetailsOutput,
} from "@/ai/flows/generate-promotion-details-flow";
import {
  generatePromotionImage,
  type GeneratePromotionImageOutput,
} from "@/ai/flows/generate-promotion-image-flow";
import {
  generateDashboardTip,
  type GenerateDashboardTipOutput,
} from "@/ai/flows/generate-dashboard-tip-flow";
import {
  analyzeMatchChallenge,
  type AnalyzeMatchChallengeInput,
  type AnalyzeMatchChallengeOutput,
} from "@/ai/flows/analyze-match-challenge-flow";
import {
  analyzeExerciseForm,
  type AnalyzeExerciseFormInput,
  type AnalyzeExerciseFormOutput,
} from "@/ai/flows/analyze-exercise-form-flow";
import {
  analyzeReport,
  type AnalyzeReportInput,
  type AnalyzeReportOutput,
} from "@/ai/flows/analyze-report-flow";
import {
  analyzeRoleChange,
  type AnalyzeRoleChangeInput,
  type AnalyzeRoleChangeOutput,
} from "@/ai/flows/analyze-role-change-flow";
import {
  analyzeDispute,
  type AnalyzeDisputeInput,
  type AnalyzeDisputeOutput,
} from "@/ai/flows/analyze-dispute-flow";
import {
  sponsorshipScout,
  type SponsorshipScoutOutput,
} from "@/ai/flows/sponsorship-scout-flow";
import {
  findCoaches,
  type FindCoachesOutput,
} from "@/ai/flows/find-coaches-flow";
import {
  findEquipment,
  type FindEquipmentInput,
  type FindEquipmentOutput,
} from "@/ai/flows/find-equipment-flow";
import {
  findLfgLobbies,
  type FindLfgLobbiesInput,
  type FindLfgLobbiesOutput,
} from "@/ai/flows/find-lfg-lobbies-flow";
import {
  findVenues,
  type FindVenuesInput,
  type FindVenuesOutput,
} from "@/ai/flows/find-venues-flow";
import {
  generateMatchPost,
  type GenerateMatchPostInput,
  type GenerateMatchPostOutput,
} from "@/ai/flows/generate-match-post-flow";
import {
  generateSportSummary,
  type GenerateSportSummaryInput,
  type GenerateSportSummaryOutput,
} from "@/ai/flows/generate-sport-summary-flow";
import {
  generateNutritionPlan,
  type GenerateNutritionPlanInput,
  type GenerateNutritionPlanOutput,
} from "@/ai/flows/generate-nutrition-plan-flow";
import {
  generateTournamentSummary,
  type GenerateTournamentSummaryInput,
  type GenerateTournamentSummaryOutput,
} from "@/ai/flows/generate-tournament-summary-flow";
import {
  generateTrainingProgram,
  type GenerateTrainingProgramInput,
  type GenerateTrainingProgramOutput,
} from "@/ai/flows/generate-training-program-flow";
import {
  getOnboardingSuggestions,
  type OnboardingInput,
  type OnboardingOutput,
} from "@/ai/flows/onboarding-assistant-flow";
import {
  predictMatchOutcome,
  type PredictMatchOutcomeInput,
  type PredictMatchOutcomeOutput,
} from "@/ai/flows/predict-match-outcome-flow";
import { playerScout, type PlayerScoutOutput, type PlayerScoutInput } from '@/ai/flows/player-scout-flow';
import { PromotionsService } from "../promotions/promotions.service";
import type { Promotion } from "@prisma/client";
import {
  generatePlaygroundChallenge,
  type GeneratePlaygroundChallengeInput,
  type GeneratePlaygroundChallengeOutput,
} from "@/ai/flows/generate-playground-challenge-flow";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class AiService {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly prisma: PrismaService,
  ) {}

  async createPromotionFromWizard(
    prompt: string,
    organizerId: string,
  ): Promise<Promotion> {
    const wizardResult = await generatePromotionWizard({ prompt });
    return this.promotionsService.create({
      ...wizardResult,
      organizerId,
      imageHint: prompt,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Mock end date
    });
  }

  async createTeam(input: CreateTeamInput): Promise<CreateTeamOutput> {
    return createTeam(input);
  }

  async generateTeamAvatar(
    input: { prompt: string },
  ): Promise<GenerateTeamAvatarOutput> {
    return generateTeamAvatar(input);
  }

  async generatePromotionDetails(
    input: GeneratePromotionDetailsInput,
  ): Promise<GeneratePromotionDetailsOutput> {
    return generatePromotionDetails(input);
  }

  async generatePromotionImage(
    prompt: string,
  ): Promise<GeneratePromotionImageOutput> {
    return generatePromotionImage(prompt);
  }

  async generateTeamConcept(
    prompt: string,
  ): Promise<GenerateTeamConceptOutput> {
    return generateTeamConcept({ prompt });
  }

  async generateUserAvatar(prompt: string): Promise<GenerateUserAvatarOutput> {
    return generateUserAvatar({ prompt });
  }

  async generateProfileBanner(
    prompt: string,
  ): Promise<GenerateProfileBannerOutput> {
    return generateProfileBanner({ prompt });
  }

  async generateDashboardNews(): Promise<NewsWithAudio> {
    return generatePlatformNewsWithAudio();
  }

  async analyzeJoinRequest(
    input: AnalyzeJoinRequestInput,
  ): Promise<AnalyzeJoinRequestOutput> {
    return analyzeJoinRequest(input);
  }

  async analyzeTeamPerformance(
    input: AnalyzeTeamPerformanceInput,
  ): Promise<AnalyzeTeamPerformanceOutput> {
    return analyzeTeamPerformance(input);
  }

  async analyzeEsportsPerformance(
    input: AnalyzeEsportsPerformanceInput,
  ): Promise<AnalyzeEsportsPerformanceOutput> {
    return analyzeEsportsPerformance(input);
  }

  async analyzeContent(
    input: AnalyzeContentInput,
  ): Promise<AnalyzeContentOutput> {
    return analyzeContent(input);
  }

  async generateContent(
    input: GenerateContentInput,
  ): Promise<GenerateContentOutput> {
    return generateContent(input);
  }

  async generateDialogue(
    topic: GenerateDialogueInput,
  ): Promise<GenerateDialogueOutput> {
    return generateDialogue(topic);
  }

  async multiSpeakerTts(
    script: MultiSpeakerTtsInput,
  ): Promise<MultiSpeakerTtsOutput> {
    return multiSpeakerTts(script);
  }

  async textToSpeech(text: TextToSpeechInput): Promise<TextToSpeechOutput> {
    return textToSpeech(text);
  }

  async analyzeSecurity(
    input: AnalyzeSecurityInput,
  ): Promise<AnalyzeSecurityOutput> {
    return analyzeSecurity(input);
  }

  async generateSocialMediaPost(
    input: GenerateSocialMediaPostInput,
  ): Promise<GenerateSocialMediaPostOutput> {
    return generateSocialMediaPost(input);
  }

  async generateSponsorshipPitch(
    input: GenerateSponsorshipPitchInput,
  ): Promise<GenerateSponsorshipPitchOutput> {
    return generateSponsorshipPitch(input);
  }

  async generatePromotionWizard(
    input: GeneratePromotionWizardInput,
  ): Promise<GeneratePromotionWizardOutput> {
    return generatePromotionWizard(input);
  }

  async generateTournamentWizard(
    input: GenerateTournamentWizardInput,
  ): Promise<GenerateTournamentWizardOutput> {
    return generateTournamentWizard(input);
  }

  async aiTeamAssistant(
    input: AiTeamAssistantInput,
  ): Promise<AiTeamAssistantOutput> {
    return aiTeamAssistant(input);
  }

  async findSponsorsForTeam(
    input: FindSponsorsForTeamInput,
  ): Promise<FindSponsorsForTeamOutput> {
    return findSponsorsForTeam(input);
  }

  async generatePostImage(
    prompt: GeneratePostImageInput,
  ): Promise<GeneratePostImageOutput> {
    return generatePostImage_Backend(prompt);
  }

  async analyzePlaygroundDetails(
    input: AnalyzePlaygroundDetailsInput,
  ): Promise<AnalyzePlaygroundDetailsOutput> {
    return analyzePlaygroundDetails(input);
  }

  async analyzePlaygroundReport(
    input: AnalyzePlaygroundReportInput,
  ): Promise<AnalyzePlaygroundReportOutput> {
    return analyzePlaygroundReport(input);
  }

  async generatePlaygroundSummary(
    input: GeneratePlaygroundSummaryInput,
  ): Promise<GeneratePlaygroundSummaryOutput> {
    return generatePlaygroundSummary(input);
  }

  async generatePlaygroundTactic(
    input: GeneratePlaygroundTacticInput,
  ): Promise<GeneratePlaygroundTacticOutput> {
    return generatePlaygroundTactic(input);
  }

  async generatePlaygroundWorkout(
    input: GeneratePlaygroundWorkoutInput,
  ): Promise<GeneratePlaygroundWorkoutOutput> {
    return generatePlaygroundWorkout(input);
  }

  async generatePlaygroundLore(
    input: GeneratePlaygroundLoreInput,
  ): Promise<GeneratePlaygroundLoreOutput> {
    return generatePlaygroundLore(input);
  }

  async generatePlaygroundDrill(
    input: GeneratePlaygroundDrillInput,
  ): Promise<GeneratePlaygroundDrillOutput> {
    return generatePlaygroundDrill(input);
  }

  async generatePlaygroundChallenge(
    input: GeneratePlaygroundChallengeInput,
  ): Promise<GeneratePlaygroundChallengeOutput> {
    return generatePlaygroundChallenge(input);
  }

  async smartSearch(query: SmartSearchInput): Promise<SmartSearchOutput> {
    return smartSearch(query);
  }

  async analyzePlayerPerformance(
    input: AnalyzePlayerPerformanceInput,
  ): Promise<AnalyzePlayerPerformanceOutput> {
    return analyzePlayerPerformance(input);
  }

  async generateTrainingPlan(
    input: GenerateTrainingPlanInput,
  ): Promise<GenerateTrainingPlanOutput> {
    return generateTrainingPlan(input);
  }

  async analyzeMatchReport(
    input: AnalyzeMatchReportInput,
  ): Promise<AnalyzeMatchReportOutput> {
    return analyzeMatchReport(input);
  }

  async generateMatchCommentary(
    input: GenerateMatchCommentaryInput,
  ): Promise<GenerateMatchCommentaryOutput> {
    return generateMatchCommentary(input);
  }

  async generateMatchInterview(
    input: GenerateMatchInterviewInput,
  ): Promise<GenerateMatchInterviewOutput> {
    return generateMatchInterview(input);
  }

  async generateMatchPost(
    input: GenerateMatchPostInput,
  ): Promise<GenerateMatchPostOutput> {
    return generateMatchPost(input);
  }

  async analyzeHolisticPerformance(
    input: AnalyzeHolisticPerformanceInput,
  ): Promise<AnalyzeHolisticPerformanceOutput> {
    return analyzeHolisticPerformance(input);
  }

  async suggestReply(input: SuggestReplyInput): Promise<SuggestReplyOutput> {
    return suggestReply(input);
  }

  async askSupportChatbot(
    query: SupportChatbotInput,
  ): Promise<SupportChatbotOutput> {
    return askSupportChatbot(query);
  }

  async generateDashboardTip(
    userId: string,
    userName: string,
  ): Promise<GenerateDashboardTipOutput> {
    const lastActivity = await this.prisma.activity.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    let lastActivityText = "Начал пользоваться платформой.";
    if (lastActivity) {
      const metadata = lastActivity.metadata as any;
      switch (lastActivity.type) {
        case "MATCH_PLAYED":
          lastActivityText = `Сыграл матч за команду ${metadata.team}. Результат: ${metadata.result} (${metadata.score}).`;
          break;
        case "TEAM_JOINED":
          lastActivityText = `Присоединился к команде "${metadata.teamName}".`;
          break;
        case "TOURNAMENT_REGISTERED":
          lastActivityText = `Зарегистрировал команду "${metadata.teamName}" на турнир "${metadata.tournamentName}".`;
          break;
      }
    }

    return generateDashboardTip({
      userName,
      lastActivity: lastActivityText,
    });
  }

  async analyzeMatchChallenge(
    input: AnalyzeMatchChallengeInput,
  ): Promise<AnalyzeMatchChallengeOutput> {
    return analyzeMatchChallenge(input);
  }

  async analyzeExerciseForm(
    input: AnalyzeExerciseFormInput,
  ): Promise<AnalyzeExerciseFormOutput> {
    return analyzeExerciseForm(input);
  }

  async analyzeReport(input: AnalyzeReportInput): Promise<AnalyzeReportOutput> {
    return analyzeReport(input);
  }

  async analyzeRoleChange(
    input: AnalyzeRoleChangeInput,
  ): Promise<AnalyzeRoleChangeOutput> {
    return analyzeRoleChange(input);
  }

  async analyzeDispute(
    input: AnalyzeDisputeInput,
  ): Promise<AnalyzeDisputeOutput> {
    return analyzeDispute(input);
  }

  async sponsorshipScout(prompt: string): Promise<SponsorshipScoutOutput> {
    return sponsorshipScout(prompt);
  }

  async findCoaches(input: string): Promise<FindCoachesOutput> {
    return findCoaches(input);
  }

  async findEquipment(input: FindEquipmentInput): Promise<FindEquipmentOutput> {
    return findEquipment(input);
  }

  async findLfgLobbies(
    input: FindLfgLobbiesInput,
  ): Promise<FindLfgLobbiesOutput> {
    return findLfgLobbies(input);
  }

  async findVenues(input: FindVenuesInput): Promise<FindVenuesOutput> {
    return findVenues(input);
  }

  async generateSportSummary(
    input: GenerateSportSummaryInput,
  ): Promise<GenerateSportSummaryOutput> {
    return generateSportSummary(input);
  }

  async generateNutritionPlan(
    input: GenerateNutritionPlanInput,
  ): Promise<GenerateNutritionPlanOutput> {
    return generateNutritionPlan(input);
  }

  async generateTournamentSummary(
    input: GenerateTournamentSummaryInput,
  ): Promise<GenerateTournamentSummaryOutput> {
    return generateTournamentSummary(input);
  }

  async generateTrainingProgram(
    input: GenerateTrainingProgramInput,
  ): Promise<GenerateTrainingProgramOutput> {
    return generateTrainingProgram(input);
  }

  async getOnboardingSuggestions(
    input: OnboardingInput,
  ): Promise<OnboardingOutput> {
    return getOnboardingSuggestions(input);
  }

  async predictMatchOutcome(
    input: PredictMatchOutcomeInput,
  ): Promise<PredictMatchOutcomeOutput> {
    return predictMatchOutcome(input);
  }

  async playerScout(input: PlayerScoutInput): Promise<PlayerScoutOutput> {
    return playerScout(input);
  }
}
