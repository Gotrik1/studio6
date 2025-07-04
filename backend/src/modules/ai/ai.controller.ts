
import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTeamConceptDto } from './dto/generate-team-concept.dto';
import type { GenerateTeamConceptOutput } from '../../ai/flows/schemas/generate-team-concept-schema';
import { GenerateUserAvatarDto } from './dto/generate-user-avatar.dto';
import type { GenerateUserAvatarOutput } from '../../ai/flows/schemas/generate-user-avatar-schema';
import { GenerateProfileBannerDto } from './dto/generate-profile-banner.dto';
import type { GenerateProfileBannerOutput } from '../../ai/flows/schemas/generate-profile-banner-schema';
import type { NewsWithAudio } from '../../ai/flows/schemas/generate-platform-news-schema';
import { AnalyzeJoinRequestDto } from './dto/analyze-join-request.dto';
import type { AnalyzeJoinRequestOutput } from '@/ai/flows/schemas/analyze-join-request-schema';
import { AnalyzeTeamPerformanceDto } from './dto/analyze-team-performance.dto';
import type { AnalyzeTeamPerformanceOutput } from '@/ai/flows/schemas/analyze-team-performance-schema';
import { AnalyzeEsportsPerformanceDto } from './dto/analyze-esports-performance.dto';
import type { AnalyzeEsportsPerformanceOutput } from '@/ai/flows/schemas/analyze-esports-performance-schema';
import { AnalyzeContentDto } from './dto/analyze-content.dto';
import { GenerateContentDto } from './dto/generate-content.dto';
import { GenerateDialogueDto } from './dto/generate-dialogue.dto';
import { MultiSpeakerTtsDto } from './dto/multi-speaker-tts.dto';
import { AnalyzeDisputeDto } from './dto/analyze-dispute.dto';
import { TextToSpeechDto } from './dto/text-to-speech.dto';
import type { AnalyzeContentOutput } from '@/ai/flows/schemas/analyze-content-generation-schema';
import type { GenerateContentOutput } from '@/ai/flows/schemas/generate-content-schema';
import type { GenerateDialogueOutput } from '@/ai/flows/schemas/dialogue-generation-schema';
import type { MultiSpeakerTtsOutput } from '@/ai/flows/schemas/multi-speaker-tts-schema';
import type { AnalyzeDisputeOutput } from '@/ai/flows/schemas/analyze-dispute-schema';
import type { TextToSpeechOutput } from '@/ai/flows/schemas/tts-schema';
import { AnalyzeSecurityDto } from './dto/analyze-security.dto';
import type { AnalyzeSecurityOutput } from '@/ai/flows/schemas/analyze-security-schema';
import { GenerateSocialMediaPostDto } from './dto/generate-social-media-post.dto';
import { GenerateSponsorshipPitchDto } from './dto/generate-sponsorship-pitch.dto';
import { SponsorshipScoutDto } from './dto/sponsorship-scout.dto';
import type { GenerateSocialMediaPostOutput } from '@/ai/flows/schemas/generate-social-media-post-schema';
import type { GenerateSponsorshipPitchOutput } from '@/ai/flows/schemas/generate-sponsorship-pitch-schema';
import type { SponsorshipScoutOutput } from '@/ai/flows/schemas/sponsorship-scout-schema';
import { GeneratePromotionWizardDto } from './dto/generate-promotion-wizard.dto';
import type { GeneratePromotionWizardOutput } from '@/ai/flows/schemas/generate-promotion-wizard-schema';
import { AiTeamAssistantDto } from './dto/ai-team-assistant.dto';
import { FindSponsorsForTeamDto } from './dto/find-sponsors-for-team.dto';
import { GeneratePostImageDto } from './dto/generate-post-image.dto';
import { GenerateTournamentWizardDto } from './dto/generate-tournament-wizard.dto';
import type { AiTeamAssistantOutput } from '@/ai/flows/schemas/ai-team-assistant-schema';
import type { FindSponsorsForTeamOutput } from '@/ai/flows/schemas/find-sponsors-for-team-schema';
import type { GeneratePostImageOutput } from '@/ai/flows/schemas/generate-post-image-schema';
import type { GenerateTournamentWizardOutput } from '@/ai/flows/schemas/generate-tournament-wizard-schema';
import { AnalyzePlaygroundDetailsDto } from './dto/analyze-playground-details.dto';
import { AnalyzePlaygroundReportDto } from './dto/analyze-playground-report.dto';
import type { AnalyzePlaygroundDetailsOutput } from '@/ai/flows/schemas/analyze-playground-details-schema';
import type { AnalyzePlaygroundReportOutput } from '@/ai/flows/schemas/analyze-playground-report-schema';
import { SmartSearchDto } from './dto/smart-search.dto';
import type { SmartSearchOutput } from '@/ai/flows/schemas/smart-search-schema';
import { GenerateTrainingPlanDto } from './dto/generate-training-plan.dto';
import { AnalyzePlayerPerformanceDto } from './dto/analyze-player-performance.dto';
import type { GenerateTrainingPlanOutput } from '@/ai/flows/schemas/generate-training-plan-schema';
import type { AnalyzePlayerPerformanceOutput } from '@/ai/flows/schemas/analyze-player-performance-schema';
import { GeneratePlaygroundWorkoutDto } from './dto/generate-playground-workout.dto';
import type { GeneratePlaygroundWorkoutOutput } from '@/ai/flows/schemas/generate-playground-workout-schema';
import { GeneratePlaygroundTacticDto } from './dto/generate-playground-tactic.dto';
import type { GeneratePlaygroundTacticOutput } from '@/ai/flows/schemas/generate-playground-tactic-schema';
import { GeneratePlaygroundLoreDto } from './dto/generate-playground-lore.dto';
import type { GeneratePlaygroundLoreOutput } from '@/ai/flows/schemas/generate-playground-lore-schema';
import { AnalyzeMatchReportDto } from './dto/analyze-match-report.dto';
import type { AnalyzeMatchReportOutput } from '@/ai/flows/schemas/analyze-match-report-schema';
import { GenerateMatchCommentaryDto } from './dto/generate-match-commentary.dto';
import type { GenerateMatchCommentaryOutput } from '@/ai/flows/schemas/generate-match-commentary-schema';
import { GenerateMatchInterviewDto } from './dto/generate-match-interview.dto';
import type { GenerateMatchInterviewOutput } from '@/ai/flows/schemas/generate-match-interview-schema';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-team-concept')
  @HttpCode(HttpStatus.OK)
  async generateTeamConcept(
    @Body() generateTeamConceptDto: GenerateTeamConceptDto,
  ): Promise<GenerateTeamConceptOutput> {
    return this.aiService.generateTeamConcept(generateTeamConceptDto.prompt);
  }

  @Post('generate-user-avatar')
  @HttpCode(HttpStatus.OK)
  async generateUserAvatar(
    @Body() generateUserAvatarDto: GenerateUserAvatarDto,
  ): Promise<GenerateUserAvatarOutput> {
    return this.aiService.generateUserAvatar(generateUserAvatarDto.prompt);
  }

  @Post('generate-profile-banner')
  @HttpCode(HttpStatus.OK)
  async generateProfileBanner(
    @Body() generateProfileBannerDto: GenerateProfileBannerDto,
  ): Promise<GenerateProfileBannerOutput> {
    return this.aiService.generateProfileBanner(generateProfileBannerDto.prompt);
  }

  @Get('dashboard-news')
  @HttpCode(HttpStatus.OK)
  async getDashboardNews(): Promise<NewsWithAudio> {
      return this.aiService.generateDashboardNews();
  }

  @Post('analyze-join-request')
  @HttpCode(HttpStatus.OK)
  async analyzeJoinRequest(
    @Body() analyzeJoinRequestDto: AnalyzeJoinRequestDto,
  ): Promise<AnalyzeJoinRequestOutput> {
    return this.aiService.analyzeJoinRequest(analyzeJoinRequestDto);
  }

  @Post('analyze-team-performance')
  @HttpCode(HttpStatus.OK)
  async analyzeTeamPerformance(
    @Body() analyzeTeamPerformanceDto: AnalyzeTeamPerformanceDto,
  ): Promise<AnalyzeTeamPerformanceOutput> {
    return this.aiService.analyzeTeamPerformance(analyzeTeamPerformanceDto);
  }

  @Post('analyze-esports-performance')
  @HttpCode(HttpStatus.OK)
  async analyzeEsportsPerformance(
    @Body() analyzeEsportsPerformanceDto: AnalyzeEsportsPerformanceDto,
  ): Promise<AnalyzeEsportsPerformanceOutput> {
    return this.aiService.analyzeEsportsPerformance(analyzeEsportsPerformanceDto);
  }

  @Post('analyze-content')
  @HttpCode(HttpStatus.OK)
  async analyzeContent(
    @Body() analyzeContentDto: AnalyzeContentDto,
  ): Promise<AnalyzeContentOutput> {
    return this.aiService.analyzeContent(analyzeContentDto);
  }

  @Post('generate-content')
  @HttpCode(HttpStatus.OK)
  async generateContent(
    @Body() generateContentDto: GenerateContentDto,
  ): Promise<GenerateContentOutput> {
    return this.aiService.generateContent(generateContentDto);
  }

  @Post('generate-dialogue')
  @HttpCode(HttpStatus.OK)
  async generateDialogue(
    @Body() generateDialogueDto: GenerateDialogueDto,
  ): Promise<GenerateDialogueOutput> {
    return this.aiService.generateDialogue(generateDialogueDto.topic);
  }

  @Post('multi-speaker-tts')
  @HttpCode(HttpStatus.OK)
  async multiSpeakerTts(
    @Body() multiSpeakerTtsDto: MultiSpeakerTtsDto,
  ): Promise<MultiSpeakerTtsOutput> {
    return this.aiService.multiSpeakerTts(multiSpeakerTtsDto.script);
  }

  @Post('analyze-dispute')
  @HttpCode(HttpStatus.OK)
  async analyzeDispute(
    @Body() analyzeDisputeDto: AnalyzeDisputeDto,
  ): Promise<AnalyzeDisputeOutput> {
    return this.aiService.analyzeDispute(analyzeDisputeDto);
  }

  @Post('text-to-speech')
  @HttpCode(HttpStatus.OK)
  async textToSpeech(
    @Body() textToSpeechDto: TextToSpeechDto,
  ): Promise<TextToSpeechOutput> {
    return this.aiService.textToSpeech(textToSpeechDto.text);
  }

  @Post('analyze-security')
  @HttpCode(HttpStatus.OK)
  async analyzeSecurity(
    @Body() analyzeSecurityDto: AnalyzeSecurityDto,
  ): Promise<AnalyzeSecurityOutput> {
    return this.aiService.analyzeSecurity(analyzeSecurityDto);
  }

  @Post('generate-social-media-post')
  @HttpCode(HttpStatus.OK)
  async generateSocialMediaPost(
    @Body() generateSocialMediaPostDto: GenerateSocialMediaPostDto,
  ): Promise<GenerateSocialMediaPostOutput> {
    return this.aiService.generateSocialMediaPost(generateSocialMediaPostDto);
  }

  @Post('generate-sponsorship-pitch')
  @HttpCode(HttpStatus.OK)
  async generateSponsorshipPitch(
    @Body() generateSponsorshipPitchDto: GenerateSponsorshipPitchDto,
  ): Promise<GenerateSponsorshipPitchOutput> {
    return this.aiService.generateSponsorshipPitch(generateSponsorshipPitchDto);
  }

  @Post('sponsorship-scout')
  @HttpCode(HttpStatus.OK)
  async sponsorshipScout(
    @Body() sponsorshipScoutDto: SponsorshipScoutDto,
  ): Promise<SponsorshipScoutOutput> {
    return this.aiService.sponsorshipScout(sponsorshipScoutDto.prompt);
  }

  @Post('generate-promotion-wizard')
  @HttpCode(HttpStatus.OK)
  async generatePromotionWizard(
    @Body() generatePromotionWizardDto: GeneratePromotionWizardDto,
  ): Promise<GeneratePromotionWizardOutput> {
    return this.aiService.generatePromotionWizard(generatePromotionWizardDto);
  }

  @Post('generate-tournament-wizard')
  @HttpCode(HttpStatus.OK)
  async generateTournamentWizard(
    @Body() generateTournamentWizardDto: GenerateTournamentWizardDto,
  ): Promise<GenerateTournamentWizardOutput> {
    return this.aiService.generateTournamentWizard(generateTournamentWizardDto);
  }

  @Post('ai-team-assistant')
  @HttpCode(HttpStatus.OK)
  async aiTeamAssistant(
    @Body() aiTeamAssistantDto: AiTeamAssistantDto,
  ): Promise<AiTeamAssistantOutput> {
    return this.aiService.aiTeamAssistant(aiTeamAssistantDto);
  }

  @Post('find-sponsors-for-team')
  @HttpCode(HttpStatus.OK)
  async findSponsorsForTeam(
    @Body() findSponsorsForTeamDto: FindSponsorsForTeamDto,
  ): Promise<FindSponsorsForTeamOutput> {
    return this.aiService.findSponsorsForTeam(findSponsorsForTeamDto);
  }

  @Post('generate-post-image')
  @HttpCode(HttpStatus.OK)
  async generatePostImage(
    @Body() generatePostImageDto: GeneratePostImageDto,
  ): Promise<GeneratePostImageOutput> {
    return this.aiService.generatePostImage(generatePostImageDto.prompt);
  }

  @Post('analyze-playground-details')
  @HttpCode(HttpStatus.OK)
  async analyzePlaygroundDetails(
    @Body() analyzePlaygroundDetailsDto: AnalyzePlaygroundDetailsDto,
  ): Promise<AnalyzePlaygroundDetailsOutput> {
    return this.aiService.analyzePlaygroundDetails(analyzePlaygroundDetailsDto);
  }

  @Post('analyze-playground-report')
  @HttpCode(HttpStatus.OK)
  async analyzePlaygroundReport(
    @Body() analyzePlaygroundReportDto: AnalyzePlaygroundReportDto,
  ): Promise<AnalyzePlaygroundReportOutput> {
    return this.aiService.analyzePlaygroundReport(analyzePlaygroundReportDto);
  }

  @Post('smart-search')
  @HttpCode(HttpStatus.OK)
  async smartSearch(
    @Body() smartSearchDto: SmartSearchDto,
  ): Promise<SmartSearchOutput> {
    return this.aiService.smartSearch(smartSearchDto.query);
  }
  
  @Post('analyze-player-performance')
  @HttpCode(HttpStatus.OK)
  async analyzePlayerPerformance(
    @Body() analyzePlayerPerformanceDto: AnalyzePlayerPerformanceDto,
  ): Promise<AnalyzePlayerPerformanceOutput> {
    return this.aiService.analyzePlayerPerformance(analyzePlayerPerformanceDto);
  }

  @Post('generate-training-plan')
  @HttpCode(HttpStatus.OK)
  async generateTrainingPlan(
    @Body() generateTrainingPlanDto: GenerateTrainingPlanDto,
  ): Promise<GenerateTrainingPlanOutput> {
    return this.aiService.generateTrainingPlan(generateTrainingPlanDto);
  }

  @Post('generate-playground-workout')
  @HttpCode(HttpStatus.OK)
  async generatePlaygroundWorkout(
    @Body() generatePlaygroundWorkoutDto: GeneratePlaygroundWorkoutDto,
  ): Promise<GeneratePlaygroundWorkoutOutput> {
    return this.aiService.generatePlaygroundWorkout(generatePlaygroundWorkoutDto);
  }

  @Post('generate-playground-tactic')
  @HttpCode(HttpStatus.OK)
  async generatePlaygroundTactic(
    @Body() generatePlaygroundTacticDto: GeneratePlaygroundTacticDto,
  ): Promise<GeneratePlaygroundTacticOutput> {
    return this.aiService.generatePlaygroundTactic(generatePlaygroundTacticDto);
  }

  @Post('generate-playground-lore')
  @HttpCode(HttpStatus.OK)
  async generatePlaygroundLore(
    @Body() generatePlaygroundLoreDto: GeneratePlaygroundLoreDto,
  ): Promise<GeneratePlaygroundLoreOutput> {
    return this.aiService.generatePlaygroundLore(generatePlaygroundLoreDto);
  }

  @Post('analyze-match-report')
  @HttpCode(HttpStatus.OK)
  async analyzeMatchReport(
    @Body() analyzeMatchReportDto: AnalyzeMatchReportDto,
  ): Promise<AnalyzeMatchReportOutput> {
    return this.aiService.analyzeMatchReport(analyzeMatchReportDto);
  }

  @Post('generate-match-commentary')
  @HttpCode(HttpStatus.OK)
  async generateMatchCommentary(
    @Body() generateMatchCommentaryDto: GenerateMatchCommentaryDto,
  ): Promise<GenerateMatchCommentaryOutput & { audioDataUri: string }> {
    return this.aiService.generateMatchCommentary(generateMatchCommentaryDto);
  }

  @Post('generate-match-interview')
  @HttpCode(HttpStatus.OK)
  async generateMatchInterview(
    @Body() generateMatchInterviewDto: GenerateMatchInterviewDto,
  ): Promise<GenerateMatchInterviewOutput> {
    return this.aiService.generateMatchInterview(generateMatchInterviewDto);
  }
}
