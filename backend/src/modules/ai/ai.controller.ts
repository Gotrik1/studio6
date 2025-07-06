
import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateTeamConceptDto } from './dto/generate-team-concept.dto';
import type { GenerateTeamConceptOutput } from '@/ai/flows/schemas/generate-team-concept-schema';
import { GenerateUserAvatarDto } from './dto/generate-user-avatar.dto';
import type { GenerateUserAvatarOutput } from '@/ai/flows/schemas/generate-user-avatar-schema';
import { GenerateProfileBannerDto } from './dto/generate-profile-banner.dto';
import type { GenerateProfileBannerOutput } from '@/ai/flows/schemas/generate-profile-banner-schema';
import type { NewsWithAudio } from '@/ai/flows/schemas/generate-platform-news-schema';
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
import { TextToSpeechDto } from './dto/text-to-speech.dto';
import type { AnalyzeContentOutput } from '@/ai/flows/schemas/analyze-content-generation-schema';
import type { GenerateContentOutput } from '@/ai/flows/schemas/generate-content-schema';
import type { GenerateDialogueOutput } from '@/ai/flows/schemas/dialogue-generation-schema';
import type { MultiSpeakerTtsOutput } from '@/ai/flows/schemas/multi-speaker-tts-schema';
import type { TextToSpeechOutput } from '@/ai/flows/schemas/tts-schema';
import { AnalyzeSecurityDto } from './dto/analyze-security.dto';
import type { AnalyzeSecurityOutput } from '@/ai/flows/schemas/analyze-security-schema';
import { GenerateSocialMediaPostDto } from './dto/generate-social-media-post.dto';
import { GenerateSponsorshipPitchDto } from './dto/generate-sponsorship-pitch.dto';
import type { GenerateSocialMediaPostOutput } from '@/ai/flows/schemas/generate-social-media-post-schema';
import type { GenerateSponsorshipPitchOutput } from '@/ai/flows/schemas/generate-sponsorship-pitch-schema';
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
import { GeneratePlaygroundSummaryDto } from './dto/generate-playground-summary.dto';
import { GeneratePlaygroundTacticDto } from './dto/generate-playground-tactic.dto';
import { GeneratePlaygroundWorkoutDto } from './dto/generate-playground-workout.dto';
import type { AnalyzePlaygroundDetailsOutput } from '@/ai/flows/schemas/analyze-playground-details-schema';
import type { AnalyzePlaygroundReportOutput } from '@/ai/flows/schemas/analyze-playground-report-schema';
import { SmartSearchDto } from './dto/smart-search.dto';
import type { SmartSearchOutput } from '@/ai/flows/smart-search-flow';
import { GenerateTrainingPlanDto } from './dto/generate-training-plan.dto';
import { AnalyzePlayerPerformanceDto } from './dto/analyze-player-performance.dto';
import type { GenerateTrainingPlanOutput } from '@/ai/flows/schemas/generate-training-plan-schema';
import type { AnalyzePlayerPerformanceOutput } from '@/ai/flows/schemas/analyze-player-performance-schema';
import { GeneratePlaygroundLoreDto } from './dto/generate-playground-lore.dto';
import type { GeneratePlaygroundLoreOutput } from '@/ai/flows/schemas/generate-playground-lore-schema';
import { GeneratePlaygroundDrillDto } from './dto/generate-playground-drill.dto';
import type { GeneratePlaygroundDrillOutput } from '@/ai/flows/schemas/generate-playground-drill-schema';
import { AnalyzeMatchReportDto } from './dto/analyze-match-report.dto';
import type { AnalyzeMatchReportOutput } from '@/ai/flows/schemas/analyze-match-report-schema';
import { GenerateMatchCommentaryDto } from './dto/generate-match-commentary.dto';
import type { GenerateMatchCommentaryOutput } from '@/ai/flows/generate-match-commentary-flow';
import { GenerateMatchInterviewDto } from './dto/generate-match-interview.dto';
import type { GenerateMatchInterviewOutput } from '@/ai/flows/schemas/generate-match-interview-schema';
import { AnalyzeHolisticPerformanceDto } from './dto/analyze-holistic-performance.dto';
import type { AnalyzeHolisticPerformanceOutput } from '@/ai/flows/schemas/analyze-holistic-performance-schema';
import { SuggestReplyDto } from './dto/suggest-reply.dto';
import type { SuggestReplyOutput } from '@/ai/flows/suggest-reply-flow';
import { SupportChatbotDto } from './dto/support-chatbot.dto';
import type { SupportChatbotOutput } from '@/ai/flows/support-chatbot-flow';
import { CreateTeamDto } from './dto/create-team.dto';
import type { CreateTeamOutput } from '@/ai/flows/schemas/create-team-schema';
import { GeneratePromotionDetailsDto } from './dto/generate-promotion-details.dto';
import type { GeneratePromotionDetailsOutput } from '@/ai/flows/schemas/generate-promotion-details-schema';
import { GeneratePromotionImageDto } from './dto/generate-promotion-image.dto';
import type { GeneratePromotionImageOutput } from '@/ai/flows/schemas/generate-promotion-image-schema';
import type { GenerateDashboardTipOutput } from '@/ai/flows/schemas/generate-dashboard-tip-schema';
import { AnalyzeMatchChallengeDto } from './dto/analyze-match-challenge.dto';
import type { AnalyzeMatchChallengeOutput } from '@/ai/flows/schemas/analyze-match-challenge-schema';
import { AnalyzeExerciseFormDto } from './dto/analyze-exercise-form.dto';
import type { AnalyzeExerciseFormOutput } from '@/ai/flows/schemas/analyze-exercise-form-schema';
import { AnalyzeReportDto } from './dto/analyze-report.dto';
import type { AnalyzeReportOutput } from '@/ai/flows/schemas/analyze-report-schema';
import { AnalyzeRoleChangeDto } from './dto/analyze-role-change.dto';
import type { AnalyzeRoleChangeOutput } from '@/ai/flows/schemas/analyze-role-change-schema';
import { AnalyzeDisputeDto } from './dto/analyze-dispute.dto';
import type { AnalyzeDisputeOutput } from '@/ai/flows/schemas/analyze-dispute-schema';
import { FindCoachesDto } from './dto/find-coaches.dto';
import type { FindCoachesOutput } from '@/ai/flows/find-coaches-flow';
import { SponsorshipScoutDto } from './dto/sponsorship-scout.dto';
import type { SponsorshipScoutOutput } from '@/ai/flows/sponsorship-scout-flow';
import { FindEquipmentDto } from './dto/find-equipment.dto';
import type { FindEquipmentOutput } from '@/ai/flows/find-equipment-flow';
import { FindLfgLobbiesDto } from './dto/find-lfg-lobbies.dto';
import type { FindLfgLobbiesOutput } from '@/ai/flows/find-lfg-lobbies-flow';
import { FindVenuesDto } from './dto/find-venues.dto';
import type { FindVenuesOutput } from '@/ai/flows/find-venues-flow';
import { GenerateMatchPostDto } from './dto/generate-match-post.dto';
import type { GenerateMatchPostOutput } from '@/ai/flows/schemas/generate-match-post-schema';
import { GenerateSportSummaryDto } from './dto/generate-sport-summary.dto';
import type { GenerateSportSummaryOutput } from '@/ai/flows/schemas/generate-sport-summary-schema';
import { GenerateNutritionPlanDto } from './dto/generate-nutrition-plan.dto';
import { GenerateTournamentSummaryDto } from './dto/generate-tournament-summary.dto';
import { GenerateTrainingProgramDto } from './dto/generate-training-program.dto';
import { OnboardingAssistantDto } from './dto/onboarding-assistant.dto';
import { PredictMatchOutcomeDto } from './dto/predict-match-outcome.dto';
import type { GenerateNutritionPlanOutput } from '@/ai/flows/schemas/generate-nutrition-plan-schema';
import type { GenerateTournamentSummaryOutput } from '@/ai/flows/schemas/generate-tournament-summary-schema';
import type { GenerateTrainingProgramOutput } from '@/ai/flows/schemas/generate-training-program-schema';
import type { OnboardingOutput } from '@/ai/flows/schemas/onboarding-assistant-schema';
import type { PredictMatchOutcomeOutput } from '@/ai/flows/schemas/predict-match-outcome-schema';
import { PlayerScoutDto } from './dto/player-scout.dto';
import type { PlayerScoutOutput } from '@/ai/flows/player-scout-flow';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { GeneratePlaygroundChallengeDto } from './dto/generate-playground-challenge.dto';
import type { GeneratePlaygroundSummaryOutput } from '@/ai/flows/schemas/generate-playground-summary-schema';
import type { GeneratePlaygroundChallengeOutput } from '@/ai/flows/schemas/generate-playground-challenge-schema';
import { GenerateTeamAvatarDto } from './dto/generate-team-avatar.dto';
import type { GenerateTeamAvatarOutput } from '@/ai/flows/schemas/generate-team-avatar-schema';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('create-team')
  @HttpCode(HttpStatus.OK)
  async createTeam(@Body() createTeamDto: CreateTeamDto): Promise<CreateTeamOutput> {
      return this.aiService.createTeam(createTeamDto);
  }

  @Post('generate-team-avatar')
  @HttpCode(HttpStatus.OK)
  async generateTeamAvatar(@Body() generateTeamAvatarDto: GenerateTeamAvatarDto): Promise<GenerateTeamAvatarOutput> {
      return this.aiService.generateTeamAvatar(generateTeamAvatarDto);
  }

  @Post('generate-promotion-details')
  @HttpCode(HttpStatus.OK)
  async generatePromotionDetails(@Body() generatePromotionDetailsDto: GeneratePromotionDetailsDto): Promise<GeneratePromotionDetailsOutput> {
      return this.aiService.generatePromotionDetails(generatePromotionDetailsDto);
  }

  @Post('generate-promotion-image')
  @HttpCode(HttpStatus.OK)
  async generatePromotionImage(@Body() generatePromotionImageDto: GeneratePromotionImageDto): Promise<GeneratePromotionImageOutput> {
      return this.aiService.generatePromotionImage(generatePromotionImageDto.prompt);
  }

  @Post('promotions/wizard')
  @ApiOperation({ summary: 'Создает концепцию промо-акции и сразу сохраняет ее' })
  async createPromotionFromWizard(@Body() dto: GeneratePromotionWizardDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.aiService.createPromotionFromWizard(dto.prompt, userId);
  }

  @Post('generate-team-concept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Сгенерировать полную концепцию команды (название, девиз, описание, аватар).' })
  @ApiBody({ type: GenerateTeamConceptDto })
  @ApiResponse({ status: 200, description: 'Концепция команды успешно сгенерирована.', type: GenerateTeamConceptDto })
  async generateTeamConcept(
    @Body() generateTeamConceptDto: GenerateTeamConceptDto,
  ): Promise<GenerateTeamConceptOutput> {
    return this.aiService.generateTeamConcept(generateTeamConceptDto.prompt);
  }

  @Post('generate-user-avatar')
  @ApiOperation({ summary: 'Generate a user avatar image' })
  @ApiResponse({ status: 200, description: 'Successfully generated avatar.' })
  @ApiBody({ type: GenerateUserAvatarDto })
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

  @Post('generate-playground-summary')
  @HttpCode(HttpStatus.OK)
  async generatePlaygroundSummary(
    @Body() generatePlaygroundSummaryDto: GeneratePlaygroundSummaryDto,
  ): Promise<GeneratePlaygroundSummaryOutput> {
    return this.aiService.generatePlaygroundSummary(generatePlaygroundSummaryDto);
  }

  @Post('generate-playground-tactic')
  @HttpCode(HttpStatus.OK)
  async generatePlaygroundTactic(
    @Body() generatePlaygroundTacticDto: GeneratePlaygroundTacticDto,
  ): Promise<GeneratePlaygroundTacticOutput> {
    return this.aiService.generatePlaygroundTactic(generatePlaygroundTacticDto);
  }
  
  @Post('generate-playground-workout')
  @HttpCode(HttpStatus.OK)
  async generatePlaygroundWorkout(
    @Body() generatePlaygroundWorkoutDto: GeneratePlaygroundWorkoutDto,
  ): Promise<GeneratePlaygroundWorkoutOutput> {
    return this.aiService.generatePlaygroundWorkout(generatePlaygroundWorkoutDto);
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

  @Post('generate-playground-lore')
  @HttpCode(HttpStatus.OK)
  async generatePlaygroundLore(
    @Body() generatePlaygroundLoreDto: GeneratePlaygroundLoreDto,
  ): Promise<GeneratePlaygroundLoreOutput> {
    return this.aiService.generatePlaygroundLore(generatePlaygroundLoreDto);
  }

  @Post('generate-playground-drill')
  @HttpCode(HttpStatus.OK)
  async generatePlaygroundDrill(
    @Body() generatePlaygroundDrillDto: GeneratePlaygroundDrillDto,
  ): Promise<GeneratePlaygroundDrillOutput> {
    return this.aiService.generatePlaygroundDrill(generatePlaygroundDrillDto);
  }

  @Post('generate-playground-challenge')
  @HttpCode(HttpStatus.OK)
  async generatePlaygroundChallenge(
    @Body() generatePlaygroundChallengeDto: GeneratePlaygroundChallengeDto,
  ): Promise<GeneratePlaygroundChallengeOutput> {
    return this.aiService.generatePlaygroundChallenge(generatePlaygroundChallengeDto);
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
  ): Promise<GenerateMatchCommentaryOutput> {
    return this.aiService.generateMatchCommentary(generateMatchCommentaryDto);
  }

  @Post('generate-match-interview')
  @HttpCode(HttpStatus.OK)
  async generateMatchInterview(
    @Body() generateMatchInterviewDto: GenerateMatchInterviewDto,
  ): Promise<GenerateMatchInterviewOutput> {
    return this.aiService.generateMatchInterview(generateMatchInterviewDto);
  }

  @Post('generate-match-post')
  @HttpCode(HttpStatus.OK)
  async generateMatchPost(@Body() generateMatchPostDto: GenerateMatchPostDto): Promise<GenerateMatchPostOutput> {
    return this.aiService.generateMatchPost(generateMatchPostDto);
  }

  @Post('generate-nutrition-plan')
  @HttpCode(HttpStatus.OK)
  async generateNutritionPlan(
    @Body() generateNutritionPlanDto: GenerateNutritionPlanDto,
  ): Promise<GenerateNutritionPlanOutput> {
    return this.aiService.generateNutritionPlan(generateNutritionPlanDto);
  }

  @Post('analyze-holistic-performance')
  @HttpCode(HttpStatus.OK)
  async analyzeHolisticPerformance(
    @Body() analyzeHolisticPerformanceDto: AnalyzeHolisticPerformanceDto,
  ): Promise<AnalyzeHolisticPerformanceOutput> {
    return this.aiService.analyzeHolisticPerformance(analyzeHolisticPerformanceDto);
  }

  @Post('suggest-reply')
  @HttpCode(HttpStatus.OK)
  async suggestReply(
    @Body() suggestReplyDto: SuggestReplyDto,
  ): Promise<SuggestReplyOutput> {
    return this.aiService.suggestReply(suggestReplyDto);
  }

  @Post('support-chatbot')
  @HttpCode(HttpStatus.OK)
  async askSupportChatbot(
    @Body() supportChatbotDto: SupportChatbotDto,
  ): Promise<SupportChatbotOutput> {
    return this.aiService.askSupportChatbot(supportChatbotDto.query);
  }
  
  @Get('dashboard-tip')
  @HttpCode(HttpStatus.OK)
  async generateDashboardTip(
    @Req() req: Request,
  ): Promise<GenerateDashboardTipOutput> {
    const user = req.user as any;
    return this.aiService.generateDashboardTip(user.userId, user.name);
  }
  
  @Post('analyze-match-challenge')
  @HttpCode(HttpStatus.OK)
  async analyzeMatchChallenge(
    @Body() analyzeMatchChallengeDto: AnalyzeMatchChallengeDto,
  ): Promise<AnalyzeMatchChallengeOutput> {
    return this.aiService.analyzeMatchChallenge(analyzeMatchChallengeDto.input);
  }

  @Post('analyze-exercise-form')
  @HttpCode(HttpStatus.OK)
  async analyzeExerciseForm(
    @Body() analyzeExerciseFormDto: AnalyzeExerciseFormDto,
  ): Promise<AnalyzeExerciseFormOutput> {
    return this.aiService.analyzeExerciseForm(analyzeExerciseFormDto);
  }

  @Post('analyze-report')
  @HttpCode(HttpStatus.OK)
  async analyzeReport(
    @Body() analyzeReportDto: AnalyzeReportDto,
  ): Promise<AnalyzeReportOutput> {
    return this.aiService.analyzeReport(analyzeReportDto);
  }

  @Post('analyze-role-change')
  @HttpCode(HttpStatus.OK)
  async analyzeRoleChange(
    @Body() analyzeRoleChangeDto: AnalyzeRoleChangeDto,
  ): Promise<AnalyzeRoleChangeOutput> {
    return this.aiService.analyzeRoleChange(analyzeRoleChangeDto);
  }

  @Post('analyze-dispute')
  @HttpCode(HttpStatus.OK)
  async analyzeDispute(
    @Body() analyzeDisputeDto: AnalyzeDisputeDto,
  ): Promise<AnalyzeDisputeOutput> {
    return this.aiService.analyzeDispute(analyzeDisputeDto);
  }
  
  @Post('find-coaches')
  @HttpCode(HttpStatus.OK)
  async findCoaches(
    @Body() findCoachesDto: FindCoachesDto,
  ): Promise<FindCoachesOutput> {
    return this.aiService.findCoaches(findCoachesDto.input);
  }

  @Post('sponsorship-scout')
  @HttpCode(HttpStatus.OK)
  async sponsorshipScout(
    @Body() sponsorshipScoutDto: SponsorshipScoutDto,
  ): Promise<SponsorshipScoutOutput> {
    return this.aiService.sponsorshipScout(sponsorshipScoutDto.prompt);
  }

  @Post('find-equipment')
  @HttpCode(HttpStatus.OK)
  async findEquipment(
    @Body() findEquipmentDto: FindEquipmentDto,
  ): Promise<FindEquipmentOutput> {
    return this.aiService.findEquipment(findEquipmentDto.input);
  }

  @Post('find-lfg-lobbies')
  @HttpCode(HttpStatus.OK)
  async findLfgLobbies(
    @Body() findLfgLobbiesDto: FindLfgLobbiesDto,
  ): Promise<FindLfgLobbiesOutput> {
    return this.aiService.findLfgLobbies(findLfgLobbiesDto.input);
  }

  @Post('find-venues')
  @HttpCode(HttpStatus.OK)
  async findVenues(
    @Body() findVenuesDto: FindVenuesDto,
  ): Promise<FindVenuesOutput> {
    return this.aiService.findVenues(findVenuesDto);
  }
  
  @Post('generate-sport-summary')
  @HttpCode(HttpStatus.OK)
  async generateSportSummary(@Body() generateSportSummaryDto: GenerateSportSummaryDto): Promise<GenerateSportSummaryOutput> {
    return this.aiService.generateSportSummary(generateSportSummaryDto);
  }

  @Post('generate-tournament-summary')
  @HttpCode(HttpStatus.OK)
  async generateTournamentSummary(
    @Body() generateTournamentSummaryDto: GenerateTournamentSummaryDto,
  ): Promise<GenerateTournamentSummaryOutput> {
    return this.aiService.generateTournamentSummary(generateTournamentSummaryDto);
  }
  
  @Post('generate-training-program')
  @HttpCode(HttpStatus.OK)
  async generateTrainingProgram(
    @Body() generateTrainingProgramDto: GenerateTrainingProgramDto,
  ): Promise<GenerateTrainingProgramOutput> {
    return this.aiService.generateTrainingProgram(generateTrainingProgramDto);
  }

  @Post('onboarding-assistant')
  @HttpCode(HttpStatus.OK)
  async getOnboardingSuggestions(
    @Body() onboardingAssistantDto: OnboardingAssistantDto,
  ): Promise<OnboardingOutput> {
    return this.aiService.getOnboardingSuggestions(onboardingAssistantDto);
  }
  
  @Post('predict-match-outcome')
  @HttpCode(HttpStatus.OK)
  async predictMatchOutcome(
    @Body() predictMatchOutcomeDto: PredictMatchOutcomeDto,
  ): Promise<PredictMatchOutcomeOutput> {
    return this.aiService.predictMatchOutcome(predictMatchOutcomeDto);
  }
  
  @Post('player-scout')
  @HttpCode(HttpStatus.OK)
  async playerScout(
    @Body() playerScoutDto: PlayerScoutDto,
  ): Promise<PlayerScoutOutput> {
    return this.aiService.playerScout(playerScoutDto.input);
  }
}
